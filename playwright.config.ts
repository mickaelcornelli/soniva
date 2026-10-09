import { defineConfig, devices } from "@playwright/test";

/** Port dédié : les tests ne gênent pas un `pnpm dev` déjà lancé sur 3000. */
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  // Les données viennent d'Audius en direct : une relance absorbe un réseau capricieux.
  retries: isCI ? 2 : 1,
  // Le rapport JSON garde le résultat de chaque test, lisible après coup. Il est rangé dans
  // test-results : le rapport HTML vide son propre dossier en fin de lancement.
  reporter: [
    isCI ? ["github"] : ["list"],
    ["json", { outputFile: "test-results/results.json" }],
    ["html", { open: "never" }],
  ],
  timeout: 45_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    locale: "fr-FR",
    trace: "on-first-retry",
    launchOptions: { args: ["--mute-audio"] },
    // Pas d'animation en cours pendant les vérifications (contrastes, clics).
    reducedMotion: "reduce",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Version de production, celle qui sera déployée : `pnpm build` doit avoir été lancé avant.
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});

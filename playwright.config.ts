import { defineConfig, devices } from "@playwright/test";

/** Dedicated port so tests don't clash with a `pnpm dev` already running on 3000. */
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  // Data comes live from Audius: a retry absorbs flaky network.
  retries: isCI ? 2 : 1,
  // The JSON report lives in test-results because the HTML reporter wipes its own folder.
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
    // No running animation during checks (contrast, clicks).
    reducedMotion: "reduce",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Tests the production build: run `pnpm build` first.
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});

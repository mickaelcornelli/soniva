// Captures the README screenshots from the live site (or PREVIEW_URL) into docs/previews.
// Usage: pnpm previews
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const BASE_URL = process.env.PREVIEW_URL ?? "https://soniva-rho.vercel.app";
const OUT_DIR = "docs/previews";

const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const MOBILE = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};

async function openContext(browser, options) {
  return browser.newContext({ ...options, locale: "fr-FR", reducedMotion: "reduce" });
}

// "networkidle" never fires once a track is playing (the audio keeps streaming), so wait
// for the covers visible in the viewport instead.
async function settle(page) {
  await page.waitForLoadState("load");
  await page
    .waitForFunction(
      () =>
        Array.from(document.images)
          .filter((img) => img.getBoundingClientRect().top < window.innerHeight)
          .every((img) => img.complete),
      null,
      { timeout: 15_000 },
    )
    .catch(() => process.stdout.write("  (some covers were still loading)\n"));
  await page.waitForTimeout(800);
}

async function capture(page, name) {
  await settle(page);
  await page.screenshot({ path: `${OUT_DIR}/${name}.png` });
  process.stdout.write(`✓ ${name}.png\n`);
}

const browser = await chromium.launch({ args: ["--mute-audio"] });
await mkdir(OUT_DIR, { recursive: true });

try {
  const desktop = await openContext(browser, DESKTOP);
  const page = await desktop.newPage();

  await page.goto(BASE_URL);
  await page.getByRole("button", { name: "Écouter le classement" }).click();
  await capture(page, "home");

  const leader = page.getByRole("article").first().getByRole("heading", { level: 2 });
  await leader.getByRole("link").click();
  await page.getByRole("heading", { level: 1 }).waitFor();
  await capture(page, "track");

  await page.goto(`${BASE_URL}/search?q=house`);
  await page.getByRole("heading", { level: 2, name: "Morceaux" }).waitFor();
  await capture(page, "search");

  await page.goto(`${BASE_URL}/genres`);
  await capture(page, "genres");

  const mobile = await openContext(browser, MOBILE);
  const phone = await mobile.newPage();

  await phone.goto(BASE_URL);
  await phone.getByRole("button", { name: "Écouter le classement" }).click();
  await capture(phone, "mobile-home");

  await phone.getByRole("button", { name: /^Ouvrir le lecteur/ }).click();
  await phone.getByRole("dialog", { name: "Lecture en cours" }).waitFor();
  await capture(phone, "mobile-player");
} finally {
  await browser.close();
}

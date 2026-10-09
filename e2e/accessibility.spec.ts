import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { openLeaderTrack } from "./helpers";

/** Règles WCAG 2.2 niveaux A et AA, la cible de la déclaration d'accessibilité. */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const STATIC_PAGES = [
  "/",
  "/search",
  "/genres",
  "/library",
  "/about",
  "/help",
  "/contact",
  "/privacy",
  "/cookies/settings",
  "/trust",
  "/accessibility",
  "/plan-du-site",
];

/** Lance axe et échoue avec un résumé lisible : règle, gravité, éléments concernés. */
async function expectNoViolations(page: Page, label: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = violations.map(({ id, impact, help, nodes }) => ({
    rule: id,
    impact,
    help,
    targets: nodes.slice(0, 5).map((node) => node.target.join(" ")),
  }));
  expect(summary, `Problèmes d'accessibilité sur ${label}`).toEqual([]);
}

test.describe("Audit d'accessibilité automatique (axe)", () => {
  for (const path of STATIC_PAGES) {
    test(`aucune violation WCAG sur ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expectNoViolations(page, path);
    });
  }

  test("aucune violation WCAG sur une page morceau, lecteur ouvert", async ({ page }) => {
    await openLeaderTrack(page);
    await page.getByRole("button", { name: "Lire", exact: true }).click();
    await expect(page.getByRole("region", { name: "Lecteur" })).toBeVisible();
    await expectNoViolations(page, "page morceau");
  });
});

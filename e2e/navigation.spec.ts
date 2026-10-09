import { expect, test } from "@playwright/test";

test.describe("Navigation et pages publiques", () => {
  test("l'accueil affiche les tendances et un lien d'évitement", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Tendances de la semaine" }),
    ).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Aller au contenu" })).toBeFocused();
  });

  test("chaque lien du pied de page mène à une page existante", async ({ page }) => {
    // About fifteen pages visited one after another.
    test.setTimeout(120_000);
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    const hrefs = await footer
      .getByRole("navigation")
      .getByRole("link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));

    expect(hrefs.length).toBeGreaterThan(10);
    for (const href of hrefs) {
      const response = await page.goto(href);
      expect(response?.status(), href).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }), href).toBeVisible();
    }
  });

  test("les contenus fictifs sont signalés et exclus des moteurs", async ({ page }) => {
    for (const [path, notice] of [
      ["/reviews", "Avis fictifs"],
      ["/jobs", "Offres fictives"],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("note")).toContainText(notice);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
  });

  test("aucune page ne déborde horizontalement", async ({ page }) => {
    for (const path of ["/", "/search?q=house", "/genres", "/library", "/privacy"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `débordement horizontal sur ${path}`).toBeLessThanOrEqual(0);
    }
  });

  test("une adresse inconnue affiche une page 404 utile", async ({ page }) => {
    const response = await page.goto("/cette-page-n-existe-pas");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Cette page n'existe pas" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Retour aux tendances" })).toBeVisible();
  });
});

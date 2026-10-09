import { expect, test } from "@playwright/test";

test.describe("Recherche instantanée", () => {
  test("affiche des résultats et garde la requête dans l'URL", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByRole("searchbox", { name: /Rechercher un morceau/ });

    await input.fill("lofi");

    await expect(page).toHaveURL(/\/search\?q=lofi$/);
    await expect(page.getByRole("heading", { level: 2, name: "Morceaux" })).toBeVisible();
  });

  test("guide l'utilisateur avant la recherche", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByRole("searchbox", { name: /Rechercher un morceau/ });

    await input.fill("a");
    await expect(page.getByText(/Encore un effort/)).toBeVisible();

    await input.fill("");
    await page.getByRole("button", { name: "Jazz", exact: true }).click();
    await expect(input).toHaveValue("Jazz");
  });

  test("une recherche partagée par lien est rendue directement", async ({ page }) => {
    await page.goto("/search?q=house");

    await expect(page.getByRole("searchbox", { name: /Rechercher un morceau/ })).toHaveValue(
      "house",
    );
    await expect(page.getByRole("heading", { level: 2, name: "Morceaux" })).toBeVisible();
  });
});

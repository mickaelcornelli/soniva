import { expect, test } from "@playwright/test";
import { leaderTitleLink, playerBar } from "./helpers";

test.describe("Lecteur global", () => {
  test("lance le classement, passe au suivant et survit à la navigation", async ({ page }) => {
    await page.goto("/");
    const leaderTitle = (await leaderTitleLink(page).textContent())?.trim() ?? "";

    await page.getByRole("button", { name: "Écouter le classement" }).click();
    const player = playerBar(page);
    await expect(player).toBeVisible();
    await expect(player).toContainText(leaderTitle);

    await player.getByRole("button", { name: "Morceau suivant" }).click();
    await expect(player).not.toContainText(leaderTitle);

    // The player lives in the layout, so it persists across pages.
    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Genres" })
      .click();
    await expect(page).toHaveURL(/\/genres$/);
    await expect(player).toBeVisible();
  });

  test("la file d'attente s'ouvre dans un panneau qui se ferme avec Échap", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Écouter le classement" }).click();
    const player = playerBar(page);

    await (
      isMobile
        ? player.getByRole("button", { name: /^Ouvrir le lecteur/ })
        : player.getByRole("button", { name: "Afficher la file d'attente" })
    ).click();

    const panel = page.getByRole("dialog", { name: "Lecture en cours" });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("heading", { name: /File d'attente/ })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });
});

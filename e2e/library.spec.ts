import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { openLeaderTrack } from "./helpers";

test.describe("Bibliothèque sans compte", () => {
  test("ajoute un favori, l'exporte puis efface l'appareil", async ({ page }) => {
    const title = await openLeaderTrack(page);

    const favorite = page.getByRole("button", {
      name: `Ajouter ${title} aux favoris`,
      exact: true,
    });
    await favorite.click();
    await expect(
      page.getByRole("button", { name: `Retirer ${title} des favoris`, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");

    await page.goto("/library");
    const favorites = page.getByRole("list", { name: /^Favoris/ });
    await expect(favorites).toContainText(title);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Télécharger mes données" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^soniva-donnees-\d{4}-\d{2}-\d{2}\.json$/);
    const exported = JSON.parse(await readFile(await download.path(), "utf8")) as {
      format: string;
      account: unknown;
      device: Record<string, unknown>;
    };
    expect(exported.format).toBe("soniva-export");
    expect(exported.account).toBeNull();
    expect(JSON.stringify(exported.device["soniva-library"])).toContain(title);

    await page.getByRole("button", { name: "Effacer les données de cet appareil" }).click();
    await page.getByRole("button", { name: "Effacer", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/library");
    await expect(page.getByRole("heading", { name: "Aucun favori pour l'instant" })).toBeVisible();
  });
});

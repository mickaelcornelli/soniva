import { expect, type Locator, type Page } from "@playwright/test";

export function playerBar(page: Page): Locator {
  return page.getByRole("region", { name: "Lecteur" });
}

export function leaderTitleLink(page: Page): Locator {
  return page.getByRole("article").first().getByRole("heading", { level: 2 }).getByRole("link");
}

export async function openLeaderTrack(page: Page): Promise<string> {
  await page.goto("/");
  const link = leaderTitleLink(page);
  const title = (await link.textContent())?.trim() ?? "";
  expect(title, "le classement doit contenir au moins un morceau").not.toBe("");
  await link.click();
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  return title;
}

import { expect, test } from "@playwright/test";

const basePath = "/boilerplate-turborepo";

test("Title이 있어야 합니다.", async ({ page }) => {
  await page.goto(basePath);

  await expect(page).toHaveTitle("Admin 페이지");
});

test("Head가 있어야 합니다.", async ({ page }) => {
  await page.goto(basePath);

  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toContainText("Generated by create next app");
});

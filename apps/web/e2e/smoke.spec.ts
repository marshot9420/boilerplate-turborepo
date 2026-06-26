import { expect, test } from "@playwright/test";

test.describe("Web E2E", () => {
  test("홈 화면에 접근할 수 있다", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.ok()).toBe(true);
    await expect(page.locator("body")).toBeVisible();
  });
});

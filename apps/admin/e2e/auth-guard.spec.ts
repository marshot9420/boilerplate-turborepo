import { expect, test } from "@playwright/test";

test.describe("Admin E2E", () => {
  test("비로그인 사용자는 관리자 홈에서 로그인 화면으로 이동한다", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
    await expect(page.locator("body")).toBeVisible();
  });
});

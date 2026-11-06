import { expect, test } from "@playwright/test";

test.describe("Web 페이지 인증", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const pagePath of [
    "/contents/create",
    "/contents/00000000-0000-4000-8000-000000000000/edit",
    "/me",
    "/me/edit",
  ]) {
    test(`비로그인 사용자는 ${pagePath}에서 로그인 화면으로 이동한다`, async ({ page }) => {
      const response = await page.goto(pagePath);

      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
      await expect(page.getByRole("heading", { name: "로그인", exact: true })).toBeVisible();
    });
  }
});

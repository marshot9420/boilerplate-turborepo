import { expect, test } from "./fixtures";

test.describe("Admin content E2E", () => {
  test("관리자가 콘텐츠를 숨기고 다시 공개하면 일반 사용자의 조회에도 반영된다", async ({
    page,
    readerPage,
    content,
  }) => {
    const contentPath = `/contents/${content.id}`;
    const savedStatus = page.getByRole("definition").filter({ hasText: /^(공개|숨김)$/ });

    await page.goto(contentPath);

    await expect(page.getByRole("heading", { name: content.title, exact: true })).toBeVisible();
    await expect(savedStatus).toHaveText("공개");

    await readerPage.goto(contentPath);

    await expect(
      readerPage.getByRole("heading", { name: content.title, exact: true }),
    ).toBeVisible();
    await expect(readerPage.getByText(content.content, { exact: true })).toBeVisible();

    await page.getByLabel("상태").selectOption("HIDDEN");
    await page.getByRole("button", { name: "상태 변경", exact: true }).click();

    await expect(savedStatus).toHaveText("숨김");
    await page.reload();
    await expect(savedStatus).toHaveText("숨김");

    const hiddenResponse = await readerPage.goto(contentPath);

    expect(hiddenResponse?.status()).toBe(404);
    await expect(readerPage.locator("body")).not.toContainText(content.title);
    await expect(readerPage.locator("body")).not.toContainText(content.content);

    await page.getByLabel("상태").selectOption("PUBLISHED");
    await page.getByRole("button", { name: "상태 변경", exact: true }).click();

    await expect(savedStatus).toHaveText("공개");
    await page.reload();
    await expect(savedStatus).toHaveText("공개");

    const publishedResponse = await readerPage.reload();

    expect(publishedResponse?.status()).toBe(200);
    await expect(
      readerPage.getByRole("heading", { name: content.title, exact: true }),
    ).toBeVisible();
    await expect(readerPage.getByText(content.content, { exact: true })).toBeVisible();
  });

  test("로그인한 일반 사용자는 관리자 콘텐츠에 접근할 수 없다", async ({ userPage }) => {
    await userPage.goto("/contents");

    await expect(userPage).toHaveURL(
      (url) => url.pathname === "/login" && url.searchParams.get("error") === "forbidden",
    );
    await expect(
      userPage.getByRole("alert").filter({ hasText: "관리자 권한이 필요합니다." }),
    ).toContainText("관리자 권한이 필요합니다.");
    await expect(userPage.getByRole("heading", { name: "콘텐츠 관리" })).toHaveCount(0);
  });
});

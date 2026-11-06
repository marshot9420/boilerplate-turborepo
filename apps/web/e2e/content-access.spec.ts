import { expect, test } from "./fixtures";

test.describe("콘텐츠 접근 권한", () => {
  test("다른 사용자의 공개 콘텐츠는 읽을 수 있지만 수정 화면과 삭제 기능에 접근할 수 없다", async ({
    otherUserPage,
    content,
  }) => {
    const response = await otherUserPage.goto(`/contents/${content.id}`);

    expect(response?.ok()).toBe(true);
    await expect(
      otherUserPage.getByRole("heading", { name: content.title, exact: true }),
    ).toBeVisible();
    await expect(otherUserPage.getByText(content.content, { exact: true })).toBeVisible();
    await expect(otherUserPage.getByRole("link", { name: "수정", exact: true })).toHaveCount(0);
    await expect(
      otherUserPage.getByRole("button", { name: "콘텐츠 삭제", exact: true }),
    ).toHaveCount(0);

    const editResponse = await otherUserPage.goto(`/contents/${content.id}/edit`);

    expect(editResponse?.status()).toBe(404);
    await expect(otherUserPage.getByRole("heading", { name: "404", exact: true })).toBeVisible();
    await expect(otherUserPage.getByLabel("제목", { exact: true })).toHaveCount(0);
  });

  test("작성자는 숨김 콘텐츠를 볼 수 있고 다른 사용자는 직접 주소로도 볼 수 없다", async ({
    page,
    otherUserPage,
    hiddenContent,
  }) => {
    await page.goto(`/contents/${hiddenContent.id}`);
    await expect(
      page.getByRole("heading", { name: hiddenContent.title, exact: true }),
    ).toBeVisible();
    await expect(page.getByText(hiddenContent.content, { exact: true })).toBeVisible();

    const response = await otherUserPage.goto(`/contents/${hiddenContent.id}`);

    expect(response?.status()).toBe(404);
    await expect(otherUserPage.getByRole("heading", { name: "404", exact: true })).toBeVisible();
    await expect(otherUserPage.getByText(hiddenContent.title, { exact: true })).toHaveCount(0);
    await expect(otherUserPage.getByText(hiddenContent.content, { exact: true })).toHaveCount(0);
  });

  test("폼의 콘텐츠 ID를 다른 작성자의 ID로 바꿔 제출해도 수정하거나 삭제할 수 없다", async ({
    page,
    otherUserPage,
    content,
    otherUserContent,
  }) => {
    await otherUserPage.goto(`/contents/${otherUserContent.id}/edit`);
    await expect(otherUserPage.getByLabel("제목", { exact: true })).toHaveValue(
      otherUserContent.title,
    );
    await otherUserPage.getByLabel("제목", { exact: true }).fill("권한 없이 변경한 제목");
    await otherUserPage.getByLabel("본문", { exact: true }).fill("권한 없이 변경한 본문");

    // 실제 렌더링된 폼의 대상만 바꿔 Server Action의 권한 경계를 검증한다.
    await otherUserPage.locator('input[type="hidden"][name="id"]').evaluate((input, id) => {
      (input as HTMLInputElement).value = id;
    }, content.id);
    await otherUserPage.getByRole("button", { name: "콘텐츠 수정", exact: true }).click();

    await expect(
      otherUserPage.getByRole("alert").filter({ hasText: "콘텐츠를 수정할 권한이 없습니다." }),
    ).toHaveText("콘텐츠를 수정할 권한이 없습니다.");
    await page.goto(`/contents/${content.id}`);
    await expect(page.getByRole("heading", { name: content.title, exact: true })).toBeVisible();
    await expect(page.getByText(content.content, { exact: true })).toBeVisible();

    await otherUserPage.goto(`/contents/${otherUserContent.id}`);
    await expect(
      otherUserPage.getByRole("heading", { name: otherUserContent.title, exact: true }),
    ).toBeVisible();
    await otherUserPage.locator('input[type="hidden"][name="id"]').evaluate((input, id) => {
      (input as HTMLInputElement).value = id;
    }, content.id);
    otherUserPage.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    await otherUserPage.getByRole("button", { name: "콘텐츠 삭제", exact: true }).click();

    await expect(
      otherUserPage.getByRole("alert").filter({ hasText: "콘텐츠를 삭제할 권한이 없습니다." }),
    ).toHaveText("콘텐츠를 삭제할 권한이 없습니다.");
    await page.reload();
    await expect(page.getByRole("heading", { name: content.title, exact: true })).toBeVisible();
    await expect(page.getByText(content.content, { exact: true })).toBeVisible();
  });
});

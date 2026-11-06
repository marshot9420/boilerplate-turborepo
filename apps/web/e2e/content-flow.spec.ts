import { expect, test } from "./fixtures";

test.describe("콘텐츠 작성자 흐름", () => {
  test("콘텐츠 생성·수정·삭제 결과가 다시 접속해도 유지된다", async ({ page, actor }) => {
    const title = `E2E 콘텐츠 ${actor.id}`;
    const body = "브라우저에서 새로 작성한 콘텐츠입니다.";
    const updatedTitle = `수정한 ${title}`;
    const updatedBody = "브라우저에서 수정하고 저장한 콘텐츠입니다.";

    await page.goto("/contents/create");
    await page.getByLabel("제목", { exact: true }).fill(title);
    await page.getByLabel("본문", { exact: true }).fill(body);
    await page.getByRole("button", { name: "콘텐츠 생성", exact: true }).click();

    await expect(page).toHaveURL(/\/contents\/[0-9a-f-]+$/);
    const detailURL = page.url();

    await page.reload();
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(page.getByText(body, { exact: true })).toBeVisible();

    await page.getByRole("link", { name: "수정", exact: true }).click();
    await expect(page.getByLabel("제목", { exact: true })).toHaveValue(title);
    await expect(page.getByLabel("본문", { exact: true })).toHaveValue(body);
    await page.getByLabel("제목", { exact: true }).fill(updatedTitle);
    await page.getByLabel("본문", { exact: true }).fill(updatedBody);
    await expect(page.getByLabel("본문", { exact: true })).toHaveValue(updatedBody);
    await page.getByRole("button", { name: "콘텐츠 수정", exact: true }).click();

    await expect(page).toHaveURL(detailURL);
    await page.reload();
    await expect(page.getByRole("heading", { name: updatedTitle, exact: true })).toBeVisible();
    await expect(page.getByText(updatedBody, { exact: true })).toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    await page.getByRole("button", { name: "콘텐츠 삭제", exact: true }).click();

    await expect(page).toHaveURL(/\/contents$/);
    await expect(page.getByRole("heading", { name: "콘텐츠", exact: true })).toBeVisible();

    const deletedResponse = await page.goto(detailURL);

    expect(deletedResponse?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
    await expect(page.getByText(updatedTitle, { exact: true })).toHaveCount(0);
    await expect(page.getByText(updatedBody, { exact: true })).toHaveCount(0);
  });
});

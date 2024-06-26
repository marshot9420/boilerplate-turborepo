import { expect, test } from "@playwright/test";

const basePath = "/admin";

test("has title", async ({ page }) => {
  await page.goto(basePath);

  await expect(page).toHaveTitle("MARSHOT — Turborepo Boilerplate - Admin");
});
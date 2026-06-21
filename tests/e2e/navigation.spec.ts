import { expect, test } from "@playwright/test";

test("Chinese MVP navigation pages render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ESSA HR 工作台" })).toBeVisible();

  await page.getByRole("link", { name: "岗位管理" }).click();
  await expect(page.getByRole("heading", { name: "岗位管理" })).toBeVisible();

  await page.getByRole("link", { name: "新增岗位" }).click();
  await expect(page.getByRole("heading", { name: "新增岗位" })).toBeVisible();

  await page.goto("/jobs/demo-job/standards");
  await expect(page.getByRole("heading", { name: "岗位标准确认" })).toBeVisible();

  await page.goto("/resume-analysis");
  await expect(page.getByRole("heading", { name: "简历分析" })).toBeVisible();

  await page.goto("/candidates");
  await expect(page.getByRole("heading", { name: "候选人结果" })).toBeVisible();

  await page.getByRole("link", { name: "查看报告" }).click();
  await expect(page.getByRole("heading", { name: "候选人报告" })).toBeVisible();
});

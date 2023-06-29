import { chromium } from "playwright";

const username = process.env.GFW_USERNAME;
const pwd = process.env.GFW_PWD;

export const GFWCheckIn = async () => {
  const browser = await chromium.launch({
    timeout: 0,
  });

  const page = await browser.newPage();
  // backup url https://gs188.one
  await page.goto("https://guangsu.buzz/auth/login", { timeout: 0 });
  // login
  await page.locator("input#email").fill(username!);
  await page.locator("input#password").fill(pwd!);
  await page.locator('button:has-text("登录")').click({ timeout: 0 });

  await page.locator("text=Read").click({ timeout: 0 });

  const checkInLabel = await page.locator("#checkin-div").textContent();

  if (checkInLabel?.trim() === "每日签到") {
    await page.locator("#checkin-div").click();
    const resultTitleLabel = await page.locator("#swal2-title").textContent();
    const resultContentLabel = await page
      .locator("#swal2-content")
      .textContent();
    if (resultTitleLabel?.trim() === "签到成功") {
      await browser.close();
      return `签到成功,${resultContentLabel}`;
    } else {
      throw new Error(
        `gfw fail:签完之后 不是 签到成功,而是${resultTitleLabel?.trim()}`
      );
    }
  } else {
    throw new Error("gfw fail:一开始就不是 每日签到");
  }
};

import { chromium } from "playwright";

const websiteUrl = process.env.GFW_URL || "";

export const GFWCheckIn = async (username: string, pwd: string) => {
  const browser = await chromium.launch({
    timeout: 0,
    // headless:false,
  });

  const page = await browser.newPage();
  // open website
  await page.goto(websiteUrl, { timeout: 20000 });
  // login
  await page.locator("input#email").fill(username!);
  await page.locator("input#password").fill(pwd!);

  // @ts-ignore
  // await page.locator('form').evaluate(form => form.submit());

  await page.locator("div:nth-of-type(5) > button").click({ timeout: 20000 });

  // incase there is a notification popup
  const tipButton = await page.locator("text=Read");

  if (page.isClosed()) {
    throw new Error("The page is closed before clicking the tip button");
  }

  if (tipButton) {
    await tipButton.waitFor({ state: "visible", timeout: 20000 }); // 等待可见
    await tipButton.click({ timeout: 20000 });
  }

  const checkInLabel = await page.locator("#checkin-div").textContent();

  try {
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
      throw new Error("gfw fail:不是 每日签到,而是" + checkInLabel?.trim());
    }
  } catch (error) {
    console.error("An error occurred:", error);
    await browser.close(); // 确保浏览器关闭
    throw error; // 重新抛出错误
  }
};

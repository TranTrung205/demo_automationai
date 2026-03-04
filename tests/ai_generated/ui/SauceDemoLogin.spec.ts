import { test } from "@playwright/test";
import { SauceDemoLoginPage } from "../../../pages/ai_generated/pom/SauceDemoLoginPage";

test("SauceDemo Login", async ({ page }) => {

  const pageObject = new SauceDemoLoginPage(page);

  await pageObject.goto("https://www.saucedemo.com");
  await pageObject.performAction("username", "standard_user");
  await pageObject.performAction("password", "secret_sauce");
  await pageObject.performAction("loginbutton");
  await pageObject.performAction("inventorylist");

});

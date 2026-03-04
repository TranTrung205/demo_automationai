import { BasePage } from "../../base/BasePage";
import { SauceDemoLoginUI } from "../ui/SauceDemoLogin.ui";

export class SauceDemoLoginPage extends BasePage {

  async performAction(
    selectorKey: string,
    value?: string
  ) {

    const selector = SauceDemoLoginUI.elements[selectorKey];

    if (!selector) {
      throw new Error("Invalid selector key: " + selectorKey);
    }

    if (value) {
      await this.fill(selector, value);
    } else {
      await this.click(selector);
    }
  }

  async expectVisible(selectorKey: string) {
    const selector = SauceDemoLoginUI.elements[selectorKey];

    if (!selector) {
      throw new Error("Invalid selector key: " + selectorKey);
    }

    await this.expectVisibleSelector(selector);
  }
}

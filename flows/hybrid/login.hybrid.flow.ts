import { Page, APIRequestContext } from '@playwright/test';
import { AuthAPIFlow } from '../api/auth.api.flow';

export class LoginHybridFlow {

  private authAPI: AuthAPIFlow;

  constructor(
    private page: Page,
    private request: APIRequestContext
  ) {
    this.authAPI = new AuthAPIFlow(request);
  }

  /**
   * Login using API then continue with UI
   */
  async login(username: string, password: string) {

    // ✅ correct call
    const token = await this.authAPI.login(username, password);

    await this.page.addInitScript(value => {
      window.localStorage.setItem('token', value);
    }, token);

    await this.page.goto('https://www.saucedemo.com/inventory.html');

  }

}

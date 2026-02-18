import { APIRequestContext } from '@playwright/test';
import { AuthAPI } from '../../api/auth.api';

export class AuthFlow {
  private authApi: AuthAPI;

  constructor(request: APIRequestContext) {
    this.authApi = new AuthAPI(request);
  }

  async loginAsDefaultUser() {
    return await this.authApi.login(
      'mor_2314',
      '83r5^_'
    );
  }
}

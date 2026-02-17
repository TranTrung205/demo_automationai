import { test, expect } from '../../fixtures/testFixture';
import { users } from '../../utils/testData';

test('User can login successfully', async ({ page, loginPage, inventoryPage }) => {
  await page.goto('/');

  await loginPage.login(users.standard.username, users.standard.password);

  await inventoryPage.verifyLoaded();
});

import * as allure from 'allure-js-commons';
import { test, expect } from '../../fixtures/test-fixtures';
import { buildUser } from '../../utils/userFactory';

test.describe('Login and logout', () => {
  test.beforeEach(async () => {
    await allure.feature('Authentication');
  });

  // register once per test so the tests stay independent of each other
  test('logs in with valid credentials', async ({ registerPage, loginPage }) => {
    const user = buildUser();
    await registerPage.register(user);
    await registerPage.logout();

    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await loginPage.expectLoggedIn();
  });

  test('rejects a wrong password', async ({ registerPage, loginPage }) => {
    const user = buildUser();
    await registerPage.register(user);
    await registerPage.logout();

    await loginPage.goto();
    await loginPage.login(user.username, 'WrongPass#1');
    await loginPage.expectLoginError('could not be verified');
  });

  test('rejects an unknown username', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('no_such_user_xyz', 'Whatever@1');
    await loginPage.expectLoginError('could not be verified');
  });

  test('asks for credentials when the form is empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', '');
    await loginPage.expectLoginError('enter a username and password');
  });

  test('logs out and returns to the login screen', async ({ registerPage, loginPage, page }) => {
    const user = buildUser();
    await registerPage.register(user);
    await registerPage.logout();

    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
    await expect(loginPage.logoutLink).toHaveCount(0);
  });

  test('forgot login info link opens customer lookup', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.openForgotLogin();
    await loginPage.expectHeading('Customer Lookup');
  });
});

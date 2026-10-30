import * as allure from 'allure-js-commons';
import { test } from '../../fixtures/test-fixtures';
import { buildUser, profiles, uniqueUsername } from '../../utils/userFactory';

test.describe('Registration', () => {
  test.beforeEach(async () => {
    await allure.feature('Registration');
  });

  for (const profile of profiles) {
    test(`registers a new user - ${profile.label}`, async ({ registerPage }) => {
      const user = buildUser(profile);
      await registerPage.register(user);
      await registerPage.expectRegistered(user.username);
    });
  }

  test('rejects a username that already exists', async ({ registerPage, page }) => {
    const user = buildUser();
    await registerPage.register(user);
    await registerPage.expectRegistered(user.username);

    await registerPage.logout();
    await registerPage.register(user);
    await registerPage.expectFieldError('customer.username', 'This username already exists');
  });

  const requiredFields = [
    { field: 'firstName', id: 'customer.firstName', message: 'First name is required' },
    { field: 'lastName', id: 'customer.lastName', message: 'Last name is required' },
    { field: 'ssn', id: 'customer.ssn', message: 'Social Security Number is required' },
  ] as const;

  for (const { field, id, message } of requiredFields) {
    test(`shows an error when ${field} is left blank`, async ({ registerPage }) => {
      const user = { ...buildUser(), [field]: '' };
      await registerPage.goto();
      await registerPage.fillForm(user);
      await registerPage.submit();
      await registerPage.expectFieldError(id, message);
    });
  }

  test('shows an error when the passwords do not match', async ({ registerPage }) => {
    const user = { ...buildUser(), username: uniqueUsername(), confirmPassword: 'Different@999' };
    await registerPage.goto();
    await registerPage.fillForm(user);
    await registerPage.submit();
    await registerPage.expectFieldError('repeatedPassword', 'Passwords did not match');
  });
});

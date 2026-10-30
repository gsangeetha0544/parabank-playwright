import * as allure from 'allure-js-commons';
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Accounts', () => {
  test.beforeEach(async () => {
    await allure.feature('Accounts');
  });

  test('overview lists the customer accounts', async ({ accountPage, session }) => {
    await accountPage.gotoOverview();
    const ids = await accountPage.accountIds();
    expect(ids.length).toBeGreaterThanOrEqual(2);
    for (const id of session.accounts) expect(ids).toContain(id);
  });

  test('overview shows a total row', async ({ accountPage }) => {
    await accountPage.gotoOverview();
    await accountPage.expectTotalRow();
  });

  for (const type of ['CHECKING', 'SAVINGS'] as const) {
    test(`opens a new ${type} account`, async ({ accountPage }) => {
      const newId = await accountPage.openNewAccount(type);
      expect(newId).toMatch(/^\d+$/);

      await accountPage.gotoOverview();
      expect(await accountPage.accountIds()).toContain(newId);
    });
  }

  test('account details page opens from the overview', async ({ accountPage, session }) => {
    await accountPage.gotoOverview();
    await accountPage.openAccountDetails(session.accounts[0]);
  });

  test('account details shows the activity section', async ({ accountPage, session, page }) => {
    await accountPage.gotoOverview();
    await accountPage.openAccountDetails(session.accounts[0]);
    await expect(page.getByRole('heading', { name: 'Account Activity' })).toBeVisible();
  });
});

import * as allure from 'allure-js-commons';
import { test } from '../../fixtures/test-fixtures';
import transfers from '../../test-data/transfers.json';

test.describe('Fund transfers', () => {
  test.beforeEach(async () => {
    await allure.feature('Transfers');
  });

  for (const { name, amount } of transfers) {
    test(`transfers between own accounts - ${name} (${amount})`, async ({ transferPage, session }) => {
      const [from, to] = session.accounts;
      await transferPage.transfer(amount, from, to);
      await transferPage.expectTransferComplete(amount, from, to);
    });
  }

  test('transfer works in the reverse direction too', async ({ transferPage, session }) => {
    const [first, second] = session.accounts;
    await transferPage.transfer('5', second, first);
    await transferPage.expectTransferComplete('5', second, first);
  });
});

import * as allure from 'allure-js-commons';
import { test } from '../../fixtures/test-fixtures';
import { formatDate } from '../../utils/userFactory';

test.describe('Transaction history', () => {
  test.beforeEach(async () => {
    await allure.feature('Transactions');
  });

  test('a completed transfer can be found by amount', async ({ transferPage, transactionsPage, session }) => {
    const [from, to] = session.accounts;
    const amount = '17.35';

    await transferPage.transfer(amount, from, to);
    await transferPage.expectTransferComplete(amount, from, to);

    await transactionsPage.findByAmount(from, amount);
    await transactionsPage.expectResultContaining(amount);
  });

  test('todays transactions show up in a date range search', async ({ transferPage, transactionsPage, session }) => {
    const [from, to] = session.accounts;
    await transferPage.transfer('2.20', from, to);

    const today = formatDate(new Date());
    await transactionsPage.findByDateRange(from, today, today);
    await transactionsPage.expectResultContaining('2.20');
  });
});

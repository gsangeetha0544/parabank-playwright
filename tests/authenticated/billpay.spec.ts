import * as allure from 'allure-js-commons';
import { test } from '../../fixtures/test-fixtures';
import payees from '../../test-data/billpay.json';

test.describe('Bill payments', () => {
  test.beforeEach(async () => {
    await allure.feature('Bill Pay');
  });

  for (const payee of payees) {
    test(`pays ${payee.payee}`, async ({ billPayPage, session }) => {
      await billPayPage.pay(payee, session.accounts[0]);
      await billPayPage.expectPaymentComplete(payee);
    });
  }

  test('rejects mismatched payee account numbers', async ({ billPayPage, session }) => {
    await billPayPage.goto();
    await billPayPage.fillPayee(payees[0], '99999');
    await billPayPage.send();
    await billPayPage.expectValidationError('account numbers do not match');
  });

  test('requires the payee fields to be filled in', async ({ billPayPage }) => {
    await billPayPage.goto();
    await billPayPage.send();
    await billPayPage.expectValidationError('Payee name is required');
  });
});

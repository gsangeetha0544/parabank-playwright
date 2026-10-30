import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../utils/step';

export class TransactionsPage extends BasePage {
  private readonly accountSelect = this.page.locator('#accountId');
  private readonly resultRows = this.page.locator('#transactionTable tbody tr');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.open('findtrans.htm');
    await this.waitForOptions(this.accountSelect);
  }

  async findByAmount(accountId: string, amount: string) {
    await step(`Find transactions of ${amount} in ${accountId}`, async () => {
      await this.goto();
      await this.accountSelect.selectOption(accountId);
      await this.page.locator('#amount').fill(amount);
      await this.page.locator('#findByAmount').click();
    });
  }

  async findByDateRange(accountId: string, from: string, to: string) {
    await step(`Find transactions between ${from} and ${to}`, async () => {
      await this.goto();
      await this.accountSelect.selectOption(accountId);
      await this.page.locator('#fromDate').fill(from);
      await this.page.locator('#toDate').fill(to);
      await this.page.locator('#findByDateRange').click();
    });
  }

  async expectResultContaining(text: string) {
    await this.expectHeading('Transaction Results');
    await expect(this.resultRows.filter({ hasText: text }).first()).toBeVisible();
  }
}

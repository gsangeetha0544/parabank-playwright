import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../utils/step';

export class AccountPage extends BasePage {
  private readonly accountTable = this.page.locator('#accountTable');
  private readonly accountLinks = this.page.locator('#accountTable tbody tr td:first-child a');

  constructor(page: Page) {
    super(page);
  }

  async gotoOverview() {
    await this.open('overview.htm');
    await this.expectHeading('Accounts Overview');
  }

  async accountIds(): Promise<string[]> {
    await expect(this.accountLinks.first()).toBeVisible();
    return (await this.accountLinks.allTextContents()).map((t) => t.trim());
  }

  async expectTotalRow() {
    await expect(this.accountTable.locator('tbody tr').last()).toContainText('Total');
  }

  async openAccountDetails(accountId: string) {
    await step(`Open details for account ${accountId}`, async () => {
      await this.accountTable.getByRole('link', { name: accountId }).click();
    });
    await this.expectHeading('Account Details');
  }

  async openNewAccount(type: 'CHECKING' | 'SAVINGS'): Promise<string> {
    return step(`Open new ${type} account`, async () => {
      await this.open('openaccount.htm');
      const typeSelect = this.page.locator('#type');
      const fromSelect = this.page.locator('#fromAccountId');
      await this.waitForOptions(fromSelect);
      await typeSelect.selectOption({ label: type });
      await this.page.getByRole('button', { name: 'Open New Account' }).click();
      await this.expectHeading('Account Opened!');
      const id = (await this.page.locator('#newAccountId').textContent()) ?? '';
      return id.trim();
    });
  }
}

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../utils/step';

export class TransferPage extends BasePage {
  private readonly amount = this.page.locator('#amount');
  private readonly from = this.page.locator('#fromAccountId');
  private readonly to = this.page.locator('#toAccountId');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.open('transfer.htm');
    await this.waitForOptions(this.from);
    await this.waitForOptions(this.to);
  }

  async transfer(amount: string, fromAccount: string, toAccount: string) {
    await step(`Transfer ${amount} from ${fromAccount} to ${toAccount}`, async () => {
      await this.goto();
      await this.amount.fill(amount);
      await this.from.selectOption(fromAccount);
      await this.to.selectOption(toAccount);
      await this.page.getByRole('button', { name: 'Transfer' }).click();
    });
  }

  async expectTransferComplete(amount: string, fromAccount: string, toAccount: string) {
    await this.expectHeading('Transfer Complete!');
    const panel = this.page.locator('#rightPanel');
    await expect(panel).toContainText(amount);
    await expect(panel).toContainText(fromAccount);
    await expect(panel).toContainText(toAccount);
  }
}

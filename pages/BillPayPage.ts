import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../utils/step';

export interface Payee {
  payee: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  account: string;
  amount: string;
}

export class BillPayPage extends BasePage {
  private input(name: string) {
    return this.page.locator(`input[name="${name}"]`);
  }

  private readonly fromAccount = this.page.locator('select[name="fromAccountId"]');

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.open('billpay.htm');
    await this.waitForOptions(this.fromAccount);
  }

  async fillPayee(p: Payee, verifyAccount = p.account) {
    await step(`Fill payee details for ${p.payee}`, async () => {
      await this.input('payee.name').fill(p.payee);
      await this.input('payee.address.street').fill(p.street);
      await this.input('payee.address.city').fill(p.city);
      await this.input('payee.address.state').fill(p.state);
      await this.input('payee.address.zipCode').fill(p.zipCode);
      await this.input('payee.phoneNumber').fill(p.phone);
      await this.input('payee.accountNumber').fill(p.account);
      await this.input('verifyAccount').fill(verifyAccount);
      await this.input('amount').fill(p.amount);
    });
  }

  async send() {
    await this.page.getByRole('button', { name: 'Send Payment' }).click();
  }

  async pay(p: Payee, fromAccountId: string) {
    await this.goto();
    await this.fillPayee(p);
    await this.fromAccount.selectOption(fromAccountId);
    await this.send();
  }

  async expectPaymentComplete(p: Payee) {
    await this.expectHeading('Bill Payment Complete');
    const panel = this.page.locator('#rightPanel');
    await expect(panel).toContainText(p.payee);
    await expect(panel).toContainText(p.amount);
  }
  async expectValidationError(message: string | RegExp) {
    const error = this.page.locator('#rightPanel .error', { hasText: message }).first();
    await expect(error).toBeVisible();
  }
}

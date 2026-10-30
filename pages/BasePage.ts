import { Page, Locator, expect } from '@playwright/test';
import { step } from '../utils/step';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get logoutLink(): Locator {
    return this.page.getByRole('link', { name: 'Log Out' });
  }

  get errorMessage(): Locator {
    return this.page.locator('#rightPanel .error');
  }

  async open(path: string) {
    await step(`Open ${path}`, async () => {
      await this.page.goto(path);
    });
  }

  async clickMenu(name: string) {
    await step(`Click menu "${name}"`, async () => {
      await this.page.locator('#leftPanel').getByRole('link', { name, exact: true }).click();
    });
  }

  async expectHeading(text: string | RegExp) {
    await expect(this.page.getByRole('heading', { name: text }).first()).toBeVisible();
  }

  async logout() {
    await step('Log out', async () => {
      await this.logoutLink.click();
    });
  }

  // the dropdowns on transfer / billpay / openaccount are filled by ajax,
  // so wait for them before touching anything
  protected async waitForOptions(select: Locator) {
    await expect(select.locator('option')).not.toHaveCount(0);
  }
}

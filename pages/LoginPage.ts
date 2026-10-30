import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../utils/step';

export class LoginPage extends BasePage {
  private readonly username = this.page.locator('input[name="username"]');
  private readonly password = this.page.locator('input[name="password"]');
  private readonly loginButton = this.page.getByRole('button', { name: 'Log In' });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.open('index.htm');
  }

  async login(username: string, password: string) {
    await step(`Log in as ${username}`, async () => {
      await this.username.fill(username);
      await this.password.fill(password);
      await this.loginButton.click();
    });
  }

  async expectLoggedIn() {
    await expect(this.logoutLink).toBeVisible();
    await this.expectHeading('Accounts Overview');
  }

  async expectLoginError(message: string | RegExp) {
    await expect(this.errorMessage).toContainText(message);
  }

  async openForgotLogin() {
    await this.page.getByRole('link', { name: 'Forgot login info?' }).click();
  }
}

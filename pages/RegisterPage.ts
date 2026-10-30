import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestUser } from '../utils/userFactory';
import { step } from '../utils/step';

export class RegisterPage extends BasePage {
  // field ids in ParaBank contain dots, so attribute selectors are the safest option
  private field(id: string) {
    return this.page.locator(`[id="${id}"]`);
  }

  private readonly registerButton = this.page.getByRole('button', { name: 'Register' });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.open('register.htm');
  }

  async fillForm(user: Partial<TestUser> & { confirmPassword?: string }) {
    await step('Fill registration form', async () => {
      const map: Record<string, string | undefined> = {
        'customer.firstName': user.firstName,
        'customer.lastName': user.lastName,
        'customer.address.street': user.street,
        'customer.address.city': user.city,
        'customer.address.state': user.state,
        'customer.address.zipCode': user.zipCode,
        'customer.phoneNumber': user.phone,
        'customer.ssn': user.ssn,
        'customer.username': user.username,
        'customer.password': user.password,
        repeatedPassword: user.confirmPassword ?? user.password,
      };
      for (const [id, value] of Object.entries(map)) {
        if (value !== undefined) await this.field(id).fill(value);
      }
    });
  }

  async submit() {
    await this.registerButton.click();
  }

  async register(user: TestUser) {
    await this.goto();
    await this.fillForm(user);
    await this.submit();
  }

  async expectRegistered(username: string) {
    await this.expectHeading(`Welcome ${username}`);
    await expect(this.page.locator('#rightPanel')).toContainText('Your account was created successfully');
  }

  async expectFieldError(id: string, message: string | RegExp) {
    await expect(this.field(`${id}.errors`)).toContainText(message);
  }
}

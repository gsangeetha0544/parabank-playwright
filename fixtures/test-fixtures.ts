import { test as base } from '@playwright/test';
import fs from 'fs';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AccountPage } from '../pages/AccountPage';
import { TransferPage } from '../pages/TransferPage';
import { BillPayPage } from '../pages/BillPayPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { SESSION_FILE } from '../utils/env';
import { TestUser } from '../utils/userFactory';

export interface Session {
  user: TestUser;
  accounts: string[];
}

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  accountPage: AccountPage;
  transferPage: TransferPage;
  billPayPage: BillPayPage;
  transactionsPage: TransactionsPage;
  session: Session;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
  transferPage: async ({ page }, use) => use(new TransferPage(page)),
  billPayPage: async ({ page }, use) => use(new BillPayPage(page)),
  transactionsPage: async ({ page }, use) => use(new TransactionsPage(page)),

  // the user + accounts that global-setup created for this run
  session: async ({}, use) => {
    const raw = fs.readFileSync(SESSION_FILE, 'utf-8');
    await use(JSON.parse(raw) as Session);
  },
});

export { expect } from '@playwright/test';

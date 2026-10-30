import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { buildUser, profiles } from './utils/userFactory';
import { AUTH_FILE, BASE_URL, SESSION_FILE } from './utils/env';

// Registers one fresh user, opens a second account and saves the logged-in
// browser state. The "authenticated" project reuses it so no test has to log in.
export default async function globalSetup(_config: FullConfig) {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  const user = buildUser(profiles[0]);
  const register = new RegisterPage(page);
  await register.register(user);
  await register.expectRegistered(user.username);

  const accounts = new AccountPage(page);
  await accounts.openNewAccount('SAVINGS');
  await accounts.gotoOverview();
  const ids = await accounts.accountIds();

  await context.storageState({ path: AUTH_FILE });
  fs.writeFileSync(SESSION_FILE, JSON.stringify({ user, accounts: ids }, null, 2));

  await browser.close();
}

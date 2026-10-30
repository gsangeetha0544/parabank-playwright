# ParaBank – Playwright automation

End-to-end UI tests for the [ParaBank demo bank](https://parabank.parasoft.com), written with
Playwright and TypeScript using the Page Object Model. Reports go to Allure, and the suite runs in Jenkins.

## What is covered

| Area | Scenarios |
|------|-----------|
| Registration | success for 3 customer profiles, duplicate username, required fields, password mismatch |
| Login / logout | valid login, wrong password, unknown user, empty form, logout, forgot-login link |
| Accounts | overview, total row, open CHECKING / SAVINGS, account details |
| Transfers | 5 amounts from `test-data/transfers.json`, reverse direction |
| Bill pay | 3 payees from `test-data/billpay.json`, mismatched account numbers, empty form |
| Transactions | find by amount, find by date range |

## Project layout

```
pages/            page objects (BasePage + one class per screen)
fixtures/         custom Playwright fixtures that hand page objects to the tests
tests/public/     tests that start logged out (register, login)
tests/authenticated/  tests that reuse the saved login session
test-data/        JSON files that drive the parameterised tests
utils/            env, user factory, step helper
global-setup.ts   registers one user, opens a 2nd account, saves storageState
Jenkinsfile       CI pipeline
```

## How it works

- **POM** - every page class extends `BasePage`; tests never touch raw selectors.
- **Auth reuse** - `global-setup.ts` registers a user once per run and saves `storageState`,
  so the `authenticated` project never has to log in.
- **Data-driven** - registration profiles, transfer amounts and payees come from JSON,
  and each row becomes its own test.
- **Waiting** - only Playwright auto-waiting and web-first assertions, no fixed sleeps.
- **Reporting** - `allure-playwright` with `test.step` annotations, `allure.feature` for grouping,
  screenshots / video / trace kept on failure.
- **CI** - `retries: 2` and 2 workers when `CI=true`.

## Running it

```bash
npm install
npx playwright install chromium

npm test                  # everything
npm run test:public       # logged-out tests only
npm run test:auth         # logged-in tests only

npm run allure:generate
npm run allure:open
```

Use `BASE_URL=... npm test` to point at a different ParaBank instance.

## Jenkins

The `Jenkinsfile` runs inside the official Playwright Docker image, executes the suite headless,
publishes the Allure report and emails the team when a build fails. It needs the Allure,
Docker Pipeline and Email Extension plugins.

## Notes

ParaBank is a shared public demo, so it can be slow or reset its data. Each run registers its own
uniquely named user so runs do not collide.

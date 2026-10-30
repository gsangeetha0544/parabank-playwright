import { test } from '@playwright/test';

// test.step only works inside a running test. global-setup reuses the same
// page objects, so fall back to just running the body there.
function insideTest(): boolean {
  try {
    test.info();
    return true;
  } catch {
    return false;
  }
}

export async function step<T>(name: string, body: () => Promise<T>): Promise<T> {
  return insideTest() ? test.step(name, body) : body();
}

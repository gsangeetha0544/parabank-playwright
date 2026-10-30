import users from '../test-data/users.json';

export interface UserProfile {
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  accountType: 'CHECKING' | 'SAVINGS';
}

export interface TestUser extends UserProfile {
  username: string;
  password: string;
}

export const profiles: UserProfile[] = users as UserProfile[];

// ParaBank usernames must be unique, so every run gets its own suffix
export function uniqueUsername(prefix = 'pb'): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${stamp}${rand}`;
}

export function buildUser(profile: UserProfile = profiles[0]): TestUser {
  return { ...profile, username: uniqueUsername(), password: 'Test@1234' };
}

// ParaBank wants MM-DD-YYYY on the find-transactions form
export function formatDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}-${dd}-${d.getFullYear()}`;
}

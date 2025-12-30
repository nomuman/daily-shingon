import { getString, setString } from './storage';

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_KEY = '@sanmitsu/theme-preference';

const isThemePreference = (value: string | null): value is ThemePreference => {
  return value === 'system' || value === 'light' || value === 'dark';
};

export async function getThemePreference(): Promise<ThemePreference> {
  const saved = await getString(THEME_KEY);
  return isThemePreference(saved) ? saved : 'system';
}

export async function setThemePreference(value: ThemePreference): Promise<void> {
  await setString(THEME_KEY, value);
}

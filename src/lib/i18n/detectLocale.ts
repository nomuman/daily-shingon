import * as Localization from 'expo-localization';
import type { LanguageCode } from './storage';

export function detectDeviceLanguage(): LanguageCode {
  const locales = Localization.getLocales();
  const first = locales?.[0];
  const lang = (first?.languageCode?.toLowerCase() ?? '').split('-')[0].trim();
  if (lang === 'ja') return 'ja';
  return 'en';
}

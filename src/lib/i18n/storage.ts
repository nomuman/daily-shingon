import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageCode = 'ja' | 'en';
export type LanguagePreference = 'system' | LanguageCode;

const KEY = 'i18n.languagePreference.v1';

export async function loadLanguagePreference(): Promise<LanguagePreference> {
  const value = await AsyncStorage.getItem(KEY);
  if (value === 'ja' || value === 'en' || value === 'system') return value;
  return 'system';
}

export async function saveLanguagePreference(pref: LanguagePreference): Promise<void> {
  await AsyncStorage.setItem(KEY, pref);
}

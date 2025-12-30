/**
 * Purpose: Persist language preference for i18n. / 目的: i18nの言語設定を永続化。
 * Responsibilities: load and save user language preference. / 役割: 言語設定の読込/保存。
 * Inputs: LanguagePreference values. / 入力: LanguagePreference値。
 * Outputs: stored preference or "system" fallback. / 出力: 保存値または"system"フォールバック。
 * Dependencies: AsyncStorage. / 依存: AsyncStorage。
 * Side effects: reads/writes persistent storage. / 副作用: 永続ストレージ読書き。
 * Edge cases: invalid stored values fall back to "system". / 例外: 不正値は"system"へ。
 */
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

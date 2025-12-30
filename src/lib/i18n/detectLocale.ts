/**
 * Purpose: Detect device language for initial locale selection. / 目的: 端末言語を検出して初期ロケールに反映。
 * Responsibilities: read device locales and map to supported language codes. / 役割: 端末ロケールを読み取り対応言語へ変換。
 * Inputs: device locale list from expo-localization. / 入力: expo-localizationのロケール一覧。
 * Outputs: LanguageCode ("ja" | "en"). / 出力: LanguageCode（"ja" | "en"）。
 * Dependencies: expo-localization. / 依存: expo-localization。
 * Side effects: none. / 副作用: なし。
 * Edge cases: missing/unknown locale defaults to "en". / 例外: 不明/未取得は"en"にフォールバック。
 */
import * as Localization from 'expo-localization';
import type { LanguageCode } from './storage';

export function detectDeviceLanguage(): LanguageCode {
  const locales = Localization.getLocales();
  const first = locales?.[0];
  const lang = (first?.languageCode?.toLowerCase() ?? '').split('-')[0].trim();
  if (lang === 'ja') return 'ja';
  return 'en';
}

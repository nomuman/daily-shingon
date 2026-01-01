/**
 * Purpose: Persist and retrieve theme preference. / 目的: テーマ設定の保存と取得。
 * Responsibilities: store theme mode and validate loaded value. / 役割: テーマモードの保存と値検証。
 * Inputs: ThemePreference value. / 入力: ThemePreference値。
 * Outputs: stored preference or "system" fallback. / 出力: 保存値または"system"フォールバック。
 * Dependencies: storage helpers. / 依存: ストレージヘルパー。
 * Side effects: reads/writes AsyncStorage. / 副作用: AsyncStorage読書き。
 * Edge cases: invalid stored value falls back to "system". / 例外: 不正値は"system"にフォールバック。
 */
import { getString, setString } from './storage';

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_KEY = '@dailyshingon/theme-preference';

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

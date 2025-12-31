/**
 * Purpose: Stack layout for primary app sections. / 目的: 主要セクション用のスタックレイアウト。
 * Responsibilities: define shared screen options. / 役割: 画面共通オプションの定義。
 * Inputs: none. / 入力: なし。
 * Outputs: configured Expo Router Stack. / 出力: 設定済みのStack。
 * Dependencies: Expo Router. / 依存: Expo Router。
 * Side effects: none. / 副作用: なし。
 * Edge cases: none (static config). / 例外: なし（静的設定）。
 */
import { Stack } from 'expo-router';

export default function TabLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

/**
 * Purpose: Stack layout for Learn sub-routes. / 目的: Learn配下のスタックレイアウト。
 * Responsibilities: define shared screen options and background color. / 役割: 共有オプションと背景色の設定。
 * Inputs: theme tokens. / 入力: テーマトークン。
 * Outputs: configured Stack. / 出力: 設定済みStack。
 * Dependencies: Expo Router, theme system. / 依存: Expo Router、テーマシステム。
 * Side effects: none. / 副作用: なし。
 * Edge cases: none. / 例外: なし。
 */
import { Stack } from 'expo-router';

import { useTheme } from '../../../ui/theme';

export default function LearnLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}

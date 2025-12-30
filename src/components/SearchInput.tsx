/**
 * Purpose: Reusable search input field with consistent styling. / 目的: 共通スタイルの検索入力。
 * Responsibilities: render a TextInput with default placeholder and search-friendly settings. / 役割: 既定プレースホルダーと検索向け設定でTextInputを描画。
 * Inputs: current value, change handler, optional placeholder. / 入力: 値、変更ハンドラ、任意のプレースホルダー。
 * Outputs: search input UI. / 出力: 検索入力UI。
 * Dependencies: i18n copy, theme tokens. / 依存: i18n文言、テーマトークン。
 * Side effects: none (delegates changes via onChangeText). / 副作用: なし（変更はコールバックへ）。
 * Edge cases: no placeholder provided. / 例外: プレースホルダー未指定。
 */
import { StyleSheet, TextInput, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useTheme, useThemedStyles } from '../ui/theme';

type SearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({ value, onChangeText, placeholder }: SearchInputProps) {
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      wrap: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
      },
      input: {
        minHeight: 44,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: theme.colors.surface,
        color: theme.colors.ink,
        fontFamily: theme.font.body,
      },
    }),
  );
  const resolvedPlaceholder = placeholder ?? t('common.search');

  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={theme.colors.inkMuted}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        style={styles.input}
      />
    </View>
  );
}

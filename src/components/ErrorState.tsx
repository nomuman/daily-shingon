/**
 * Purpose: Reusable full-screen error state with optional actions. / 目的: 画面全体で使えるエラー表示コンポーネント。
 * Responsibilities: show error title/message and render primary/secondary actions. / 役割: タイトル/本文表示と主/副アクション表示。
 * Inputs: optional title/labels and callbacks. / 入力: 任意のタイトル/ラベル/コールバック。
 * Outputs: error UI block within SafeAreaView. / 出力: SafeAreaView内のエラーUI。
 * Dependencies: i18n for default labels, theme tokens. / 依存: 既定ラベル用i18n、テーマトークン。
 * Side effects: none (delegates actions via callbacks). / 副作用: なし（コールバックへ委譲）。
 * Edge cases: missing callbacks hide buttons. / 例外: コールバック未指定時はボタン非表示。
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { useThemedStyles } from '../ui/theme';

type ErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export default function ErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  secondaryLabel,
  onSecondaryPress,
}: ErrorStateProps) {
  const { t } = useTranslation('common');
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      container: {
        flex: 1,
        padding: theme.spacing.lg,
        gap: theme.spacing.sm,
        justifyContent: 'center',
      },
      title: {
        fontSize: 18,
        fontFamily: theme.font.display,
        color: theme.colors.ink,
      },
      message: {
        lineHeight: 20,
        color: theme.colors.inkMuted,
        fontFamily: theme.font.body,
      },
      primaryButton: {
        minHeight: 44,
        paddingHorizontal: 14,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.ink,
      },
      primaryButtonPressed: {
        opacity: 0.9,
      },
      primaryButtonText: {
        color: theme.colors.surface,
        fontWeight: '700',
        fontFamily: theme.font.body,
      },
      ghostButton: {
        minHeight: 44,
        paddingHorizontal: 14,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      },
      ghostButtonPressed: {
        opacity: 0.85,
      },
      ghostButtonText: {
        fontWeight: '700',
        color: theme.colors.ink,
        fontFamily: theme.font.body,
      },
    }),
  );
  const resolvedTitle = title ?? t('errors.defaultTitle');
  const resolvedRetryLabel = retryLabel ?? t('common.retry');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{resolvedTitle}</Text>
        <Text style={styles.message}>{message}</Text>

        {onRetry && (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonText}>{resolvedRetryLabel}</Text>
          </Pressable>
        )}

        {secondaryLabel && onSecondaryPress && (
          <Pressable
            onPress={onSecondaryPress}
            style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
          >
            <Text style={styles.ghostButtonText}>{secondaryLabel}</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

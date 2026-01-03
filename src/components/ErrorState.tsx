/**
 * Purpose: Reusable full-screen error state with optional actions. / 目的: 画面全体で使えるエラー表示コンポーネント。
 * Responsibilities: show error title/message and render primary/secondary actions. / 役割: タイトル/本文表示と主/副アクション表示。
 * Inputs: optional title/labels and callbacks. / 入力: 任意のタイトル/ラベル/コールバック。
 * Outputs: error UI block within SafeAreaView. / 出力: SafeAreaView内のエラーUI。
 * Dependencies: i18n for default labels, theme tokens. / 依存: 既定ラベル用i18n、テーマトークン。
 * Side effects: none (delegates actions via callbacks). / 副作用: なし（コールバックへ委譲）。
 * Edge cases: missing callbacks hide buttons. / 例外: コールバック未指定時はボタン非表示。
 */
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import AppButton from './AppButton';
import BackButton from './BackButton';
import Screen from './Screen';
import { useResponsiveLayout } from '../ui/responsive';
import { useThemedStyles } from '../ui/theme';

type ErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  showBack?: boolean;
  backLabel?: string;
};

export default function ErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  secondaryLabel,
  onSecondaryPress,
  showBack = false,
  backLabel,
}: ErrorStateProps) {
  const { t } = useTranslation('common');
  const responsive = useResponsiveLayout();
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      wrapper: {
        flex: 1,
      },
      backButton: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
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
    }),
  );
  const resolvedTitle = title ?? t('errors.defaultTitle');
  const resolvedRetryLabel = retryLabel ?? t('common.retry');

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.wrapper}>
        {showBack && <BackButton label={backLabel} style={styles.backButton} />}
        <View style={[styles.container, responsive.contentStyle]}>
          <Text style={styles.title}>{resolvedTitle}</Text>
          <Text style={styles.message}>{message}</Text>

          {onRetry && (
            <AppButton label={resolvedRetryLabel} onPress={onRetry} variant="primary" />
          )}

          {secondaryLabel && onSecondaryPress && (
            <AppButton label={secondaryLabel} onPress={onSecondaryPress} variant="ghost" />
          )}
        </View>
      </View>
    </Screen>
  );
}

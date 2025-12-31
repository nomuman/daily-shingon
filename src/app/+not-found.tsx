/**
 * Purpose: 404-style fallback screen for unknown routes. / 目的: 未知ルート用の404フォールバック画面。
 * Responsibilities: present a friendly message and link back to home. / 役割: メッセージ表示とホームへの導線提供。
 * Inputs: i18n copy and theme tokens. / 入力: i18n文言、テーマトークン。
 * Outputs: centered UI with a navigation link. / 出力: 中央寄せUIとリンク。
 * Dependencies: Expo Router Link, theme system, SafeAreaView. / 依存: Expo Router Link、テーマシステム、SafeAreaView。
 * Side effects: none. / 副作用: なし。
 * Edge cases: none (static screen). / 例外: なし（静的画面）。
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';
import { useResponsiveLayout } from '../ui/responsive';
import { useThemedStyles } from '../ui/theme';

export default function NotFoundScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const responsive = useResponsiveLayout();
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      container: {
        flex: 1,
        gap: theme.spacing.sm,
        padding: theme.spacing.lg,
      },
      backButton: {
        paddingTop: theme.spacing.xs,
      },
      content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
      },
      title: {
        fontSize: 18,
        fontFamily: theme.font.display,
        color: theme.colors.ink,
        textAlign: 'center',
      },
      body: {
        color: theme.colors.inkMuted,
        textAlign: 'center',
        fontFamily: theme.font.body,
      },
    }),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={[styles.container, responsive.contentStyle]}>
        <BackButton
          label={t('notFound.backHome')}
          onPress={() => router.replace('/')}
          style={styles.backButton}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{t('notFound.title')}</Text>
          <Text style={styles.body}>{t('notFound.body')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

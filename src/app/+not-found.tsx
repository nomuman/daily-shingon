/**
 * Purpose: 404-style fallback screen for unknown routes. / 目的: 未知ルート用の404フォールバック画面。
 * Responsibilities: present a friendly message and link back to home. / 役割: メッセージ表示とホームへの導線提供。
 * Inputs: i18n copy and theme tokens. / 入力: i18n文言、テーマトークン。
 * Outputs: centered UI with a navigation link. / 出力: 中央寄せUIとリンク。
 * Dependencies: Expo Router Link, theme system, SafeAreaView. / 依存: Expo Router Link、テーマシステム、SafeAreaView。
 * Side effects: none. / 副作用: なし。
 * Edge cases: none (static screen). / 例外: なし（静的画面）。
 */
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { useThemedStyles } from '../ui/theme';

export default function NotFoundScreen() {
  const { t } = useTranslation('common');
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        padding: theme.spacing.lg,
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
      link: {
        color: theme.colors.accentDark,
        fontWeight: '700',
        fontFamily: theme.font.body,
      },
    }),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('notFound.title')}</Text>
        <Text style={styles.body}>{t('notFound.body')}</Text>
        <Link href="/" style={styles.link}>
          {t('notFound.backHome')}
        </Link>
      </View>
    </SafeAreaView>
  );
}

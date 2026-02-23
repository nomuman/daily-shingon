/**
 * Purpose: Web OAuth callback handler screen. / 目的: Web OAuthコールバック処理画面。
 * Responsibilities: exchange PKCE code for a session and show status. / 役割: PKCEコード交換とステータス表示。
 * Inputs: URL with ?code=. / 入力: ?code=付きURL。
 * Outputs: status message. / 出力: ステータスメッセージ。
 * Dependencies: supabase auth helper, theme, SafeAreaView. / 依存: 認証ヘルパー、テーマ、SafeAreaView。
 */
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { handleAuthCallbackUrl } from '../../auth/signInWithEmail';
import Screen from '../../components/Screen';
import { useThemedStyles } from '../../ui/theme';

export default function AuthCallbackScreen() {
  const { t } = useTranslation('common');
  const [message, setMessage] = useState(t('common.loadingSimple'));
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
      },
      title: {
        fontSize: 18,
        fontFamily: theme.font.display,
        color: theme.colors.ink,
        textAlign: 'center',
      },
      body: {
        marginTop: theme.spacing.sm,
        color: theme.colors.inkMuted,
        textAlign: 'center',
        fontFamily: theme.font.body,
      },
    }),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    handleAuthCallbackUrl(window.location.href)
      .then(() => setMessage(t('settings.sync.signInSuccess')))
      .catch(() => setMessage(t('settings.sync.signInFail')));
  }, [t]);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('app.name')}</Text>
        <Text style={styles.body}>{message}</Text>
      </View>
    </Screen>
  );
}

/**
 * Purpose: Web OAuth callback handler screen. / 目的: Web OAuthコールバック処理画面。
 * Responsibilities: exchange PKCE code for a session and show status. / 役割: PKCEコード交換とステータス表示。
 * Inputs: URL with ?code=. / 入力: ?code=付きURL。
 * Outputs: status message. / 出力: ステータスメッセージ。
 * Dependencies: supabase auth helper, theme, SafeAreaView. / 依存: 認証ヘルパー、テーマ、SafeAreaView。
 */
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { handleAuthCallbackUrl } from '../../auth/signInWithEmail';
import { useThemedStyles } from '../../ui/theme';

export default function AuthCallbackScreen() {
  const [message, setMessage] = useState('Signing you in...');
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
      .then(() => setMessage('Signed in.'))
      .catch(() => setMessage('Sign-in failed.'));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>Supabase</Text>
        <Text style={styles.body}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

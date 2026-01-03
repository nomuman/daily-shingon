/**
 * Purpose: App root layout and global providers. / 目的: アプリのルートレイアウトと全体プロバイダ。
 * Responsibilities: configure notification behavior, initialize i18n, and mount navigation stack. / 役割: 通知設定、i18n初期化、ナビゲーションスタックの構築。
 * Inputs: theme provider, i18n init, Expo Router stack. / 入力: テーマプロバイダ、i18n初期化、Expo Routerスタック。
 * Outputs: provider-wrapped app and a loading gate before routes render. / 出力: プロバイダ適用済みアプリとルート表示前のローディングゲート。
 * Dependencies: expo-notifications, expo-router, i18n, theme system, SafeAreaProvider. / 依存: expo-notifications、expo-router、i18n、テーマシステム、SafeAreaProvider。
 * Side effects: global notification handler setup, i18n initialization. / 副作用: 通知ハンドラ設定、i18n初期化。
 * Edge cases: i18n init failure (falls back to ready state to avoid blocking). / 例外: i18n初期化失敗時は表示継続のためreadyにフォールバック。
 */
import * as LinkingExpo from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ZenOldMincho_400Regular } from '@expo-google-fonts/zen-old-mincho';
import {
  ZenKakuGothicNew_400Regular,
  ZenKakuGothicNew_500Medium,
} from '@expo-google-fonts/zen-kaku-gothic-new';

import { handleAuthCallbackUrl } from '../auth/signInWithEmail';
import { initI18n } from '../lib/i18n';
import { ThemeProvider, useTheme, useThemedStyles } from '../ui/theme';

// Global notification presentation policy (UI-only, no sound/badge by default). / 通知表示方針（バナー/一覧のみ、音/バッジ無し）。
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutContent() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    ZenOldMincho_400Regular,
    ZenKakuGothicNew_400Regular,
    ZenKakuGothicNew_500Medium,
  });
  const { theme } = useTheme();
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
      },
    }),
  );

  // Initialize i18n once and avoid setting state after unmount. / i18nを初期化し、アンマウント後の更新を防ぐ。
  useEffect(() => {
    let mounted = true;
    initI18n()
      .then(() => mounted && setReady(true))
      .catch(() => mounted && setReady(true));
    return () => {
      mounted = false;
    };
  }, []);

  // Handle deep links for email auth (native only). / メール認証のディープリンク処理（ネイティブのみ）。
  useEffect(() => {
    if (Platform.OS === 'web') return;
    let mounted = true;

    LinkingExpo.getInitialURL()
      .then((url) => {
        if (!mounted || !url) return;
        return handleAuthCallbackUrl(url);
      })
      .catch((err) => {
        console.warn('Failed to handle initial auth link.', err);
      });

    const subscription = LinkingExpo.addEventListener('url', ({ url }) => {
      handleAuthCallbackUrl(url).catch((err) => {
        console.warn('Failed to handle auth link.', err);
      });
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  // Gate UI until i18n is initialized (or fails gracefully). / i18n初期化までUIを待機。
  if (!ready || !fontsLoaded) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

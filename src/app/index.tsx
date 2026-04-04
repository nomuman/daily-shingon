/**
 * Purpose: Root entry route that sends first-time users through onboarding. / 目的: 初回ユーザーをオンボーディングへ振り分けるルート入口。
 * Responsibilities: read onboarding state and redirect to onboarding or tabs. / 役割: オンボーディング状態を読み取り、オンボーディングまたはタブへ遷移。
 * Inputs: persisted onboarding completion flag. / 入力: 保存済みのオンボーディング完了フラグ。
 * Outputs: redirect destination or a loading screen while resolving. / 出力: リダイレクト先、または読込中画面。
 * Dependencies: Expo Router redirect, onboarding storage helper, theme tokens. / 依存: Expo RouterのRedirect、オンボーディング保存ヘルパー、テーマ。
 * Side effects: AsyncStorage read on mount. / 副作用: マウント時のAsyncStorage読込。
 * Edge cases: storage read failures fall back to showing onboarding. / 例外: 読込失敗時はオンボーディングへフォールバック。
 */
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Screen from '../components/Screen';
import { hasCompletedOnboarding } from '../lib/onboarding';
import { useTheme, useThemedStyles } from '../ui/theme';

export default function AppEntryScreen() {
  const { theme } = useTheme();
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      loadingWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    }),
  );
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    hasCompletedOnboarding()
      .then((value) => {
        if (!mounted) return;
        setCompleted(value);
      })
      .catch(() => {
        if (!mounted) return;
        setCompleted(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (completed === null) {
    return (
      <Screen edges={['top', 'bottom']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </Screen>
    );
  }

  return <Redirect href={completed ? '/(tabs)' : '/onboarding'} />;
}

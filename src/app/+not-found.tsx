import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../ui/theme';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>ページが見つかりません</Text>
        <Text style={styles.body}>URLが間違っているか、ページが移動した可能性があります。</Text>
        <Link href="/" style={styles.link}>
          ホームへ戻る
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});

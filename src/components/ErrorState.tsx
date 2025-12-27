import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../ui/theme';

type ErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export default function ErrorState({
  title = '読み込みに失敗しました',
  message,
  retryLabel = '再試行',
  onRetry,
  secondaryLabel,
  onSecondaryPress,
}: ErrorStateProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {onRetry && (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonText}>{retryLabel}</Text>
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

const styles = StyleSheet.create({
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
});

import { Pressable, Text, View } from 'react-native';

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
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>
      <Text style={{ lineHeight: 20 }}>{message}</Text>

      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={{ padding: 12, borderRadius: 10, backgroundColor: '#000', alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>{retryLabel}</Text>
        </Pressable>
      )}

      {secondaryLabel && onSecondaryPress && (
        <Pressable
          onPress={onSecondaryPress}
          style={{ padding: 12, borderRadius: 10, backgroundColor: '#ddd', alignItems: 'center' }}
        >
          <Text style={{ fontWeight: '700' }}>{secondaryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

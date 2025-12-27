import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>ページが見つかりません</Text>
      <Text style={{ opacity: 0.7 }}>URLが間違っているか、ページが移動した可能性があります。</Text>
      <Link href="/" style={{ color: '#000', fontWeight: '700' }}>
        ホームへ戻る
      </Link>
    </View>
  );
}

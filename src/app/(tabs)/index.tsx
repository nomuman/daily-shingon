// app/(tabs)/index.tsx
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { getDayCard } from '../../content/curriculum30.ja';
import { getProgramDayInfo } from '../../lib/programDay';
import { clearTodayActionSelection, getTodayActionSelection } from '../../lib/todayLog';

export default function HomeScreen() {
  const router = useRouter();

  const [dayNumber, setDayNumber] = useState<number>(1);
  const [title, setTitle] = useState<string>('');
  const [todayAction, setTodayAction] = useState<{ key: string; text: string } | null>(null);

  const refresh = useCallback(async () => {
    const info = await getProgramDayInfo();
    setDayNumber(info.dayNumber);
    const card = getDayCard(info.dayNumber);
    setTitle(card.title);

    const sel = await getTodayActionSelection();
    setTodayAction(sel ? { key: sel.selectedKey, text: sel.selectedText } : null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      // cleanup不要ならreturnなしでOK
    }, [refresh])
  );

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Home</Text>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ opacity: 0.7 }}>今日</Text>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Day {dayNumber}</Text>
        <Text style={{ lineHeight: 20 }}>{title}</Text>
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>今日の行い</Text>
        {todayAction ? (
          <Text style={{ lineHeight: 20 }}>
            ・[{todayAction.key}] {todayAction.text}
          </Text>
        ) : (
          <Text style={{ opacity: 0.7 }}>まだ選んでない。Learnで「今日はこれでいく」を押してね。</Text>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={() => router.push('/learn')}
            style={{ padding: 12, borderRadius: 12, backgroundColor: '#000' }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Learnへ</Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              await clearTodayActionSelection();
              await refresh();
            }}
            style={{ padding: 12, borderRadius: 12, backgroundColor: '#ddd' }}
          >
            <Text style={{ fontWeight: '700' }}>選択を解除</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <Text style={{ opacity: 0.6 }}>
        ※ 画面復帰時に最新を反映するため、フォーカス時に再読み込みしています。
      </Text>
    </View>
  );
}

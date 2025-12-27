// app/(tabs)/index.tsx
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { getDayCard } from '../../content/curriculum30.ja';
import { clearMorningLog, getMorningLog, isMorningComplete } from '../../lib/morningLog';
import { getProgramDayInfo } from '../../lib/programDay';
import { clearTodayActionSelection, getTodayActionSelection } from '../../lib/todayLog';

export default function HomeScreen() {
  const router = useRouter();

  const [dayNumber, setDayNumber] = useState<number>(1);
  const [title, setTitle] = useState<string>('');

  const [todayAction, setTodayAction] = useState<{ key: string; text: string } | null>(null);

  const [morningDone, setMorningDone] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    // Day情報
    const info = await getProgramDayInfo();
    setDayNumber(info.dayNumber);

    const card = getDayCard(info.dayNumber);
    setTitle(card.title);

    // 今日の行い
    const sel = await getTodayActionSelection();
    setTodayAction(sel ? { key: sel.selectedKey, text: sel.selectedText } : null);

    // 朝チェック
    const m = await getMorningLog();
    setMorningDone(isMorningComplete(m));
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
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

      {/* 朝の整え */}
      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>朝の整え（身・口・意）</Text>
        <Text style={{ opacity: 0.75 }}>
          状態：{morningDone ? '完了 ✅' : '未完了'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={() => router.push('/morning')}
            style={{ padding: 12, borderRadius: 12, backgroundColor: '#000' }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {morningDone ? '見直す' : 'やる'}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              await clearMorningLog();
              await refresh();
            }}
            style={{ padding: 12, borderRadius: 12, backgroundColor: '#ddd' }}
          >
            <Text style={{ fontWeight: '700' }}>リセット</Text>
          </Pressable>
        </View>
      </View>

      {/* 今日の行い */}
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
        ※ タブ移動・戻る操作で最新を反映するため、フォーカス時に再読み込みしています。
      </Text>
    </View>
  );
}

import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { parseISODateLocal } from '../../lib/date';
import { getMorningLog, isMorningComplete } from '../../lib/morningLog';
import { getNightLog, isNightComplete } from '../../lib/nightLog';

export default function DayDetailScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date?: string }>();

  const [morningDone, setMorningDone] = useState(false);
  const [nightDone, setNightDone] = useState(false);
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    if (!date) return;
    const day = parseISODateLocal(date);

    const morning = await getMorningLog(day);
    const night = await getNightLog(day);

    setMorningDone(isMorningComplete(morning));
    setNightDone(isNightComplete(night));
    setNote(night?.note ?? '');
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  if (!date) return null;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{date}</Text>
        <Pressable
          onPress={() => router.back()}
          style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#ddd' }}
        >
          <Text style={{ fontWeight: '700' }}>Back</Text>
        </Pressable>
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>状態</Text>
        <Text>朝：{morningDone ? '完了 ✅' : '—'}</Text>
        <Text>夜：{nightDone ? '完了 ✅' : '—'}</Text>
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>夜のひと言</Text>
        {note.trim().length > 0 ? (
          <Text style={{ lineHeight: 20 }}>{note}</Text>
        ) : (
          <Text style={{ opacity: 0.7 }}>（なし）</Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={() => router.push('/morning')}
          style={{ padding: 12, borderRadius: 12, backgroundColor: '#000' }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>朝へ</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/night')}
          style={{ padding: 12, borderRadius: 12, backgroundColor: '#000' }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>夜へ</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

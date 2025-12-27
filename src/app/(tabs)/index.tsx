import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import ErrorState from '../../components/ErrorState';
import { getDayCard } from '../../content/curriculum30.ja';
import { getProgramDayInfo } from '../../lib/programDay';

import { clearMorningLog, getMorningLog, isMorningComplete } from '../../lib/morningLog';
import { clearNightLog, getNightLog, isNightComplete } from '../../lib/nightLog';
import { clearTodayActionSelection, getTodayActionSelection } from '../../lib/todayLog';

export default function HomeScreen() {
  const router = useRouter();

  const [dayNumber, setDayNumber] = useState<number>(1);
  const [title, setTitle] = useState<string>('');

  const [todayAction, setTodayAction] = useState<{ key: string; text: string } | null>(null);

  const [morningDone, setMorningDone] = useState<boolean>(false);
  const [nightDone, setNightDone] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const info = await getProgramDayInfo();
      setDayNumber(info.dayNumber);

      const card = getDayCard(info.dayNumber);
      setTitle(card.title);

      const sel = await getTodayActionSelection();
      setTodayAction(sel ? { key: sel.selectedKey, text: sel.selectedText } : null);

      const m = await getMorningLog();
      setMorningDone(isMorningComplete(m));

      const n = await getNightLog();
      setNightDone(isNightComplete(n));
    } catch {
      setError('保存データの読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );
  // useFocusEffectは「画面がフォーカスされた時に処理を走らせる」ためのフック（公式）。:contentReference[oaicite:5]{index=5}

  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

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
        <Text style={{ opacity: 0.75 }}>状態：{morningDone ? '完了 ✅' : '未完了'}</Text>

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
              try {
                await clearMorningLog();
                await refresh();
              } catch {
                setError(
                  '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
                );
              }
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
          <Text style={{ opacity: 0.7 }}>
            まだ選んでない。Learnで「今日はこれでいく」を押してね。
          </Text>
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
              try {
                await clearTodayActionSelection();
                await refresh();
              } catch {
                setError(
                  '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
                );
              }
            }}
            style={{ padding: 12, borderRadius: 12, backgroundColor: '#ddd' }}
          >
            <Text style={{ fontWeight: '700' }}>選択を解除</Text>
          </Pressable>
        </View>
      </View>

      {/* 夜のしめ */}
      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>夜のしめ（懺悔→発願→回向）</Text>
        <Text style={{ opacity: 0.75 }}>状態：{nightDone ? '完了 ✅' : '未完了'}</Text>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={() => router.push('/night')}
            style={{ padding: 12, borderRadius: 12, backgroundColor: '#000' }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {nightDone ? '見直す' : 'やる'}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              try {
                await clearNightLog();
                await refresh();
              } catch {
                setError(
                  '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
                );
              }
            }}
            style={{ padding: 12, borderRadius: 12, backgroundColor: '#ddd' }}
          >
            <Text style={{ fontWeight: '700' }}>リセット</Text>
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

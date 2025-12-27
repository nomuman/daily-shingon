// app/(tabs)/night.tsx
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import ErrorState from '../../components/ErrorState';
import { getDayCard } from '../../content/curriculum30.ja';
import { clearNightLog, getNightLog, isNightComplete, setNightLog } from '../../lib/nightLog';
import { getProgramDayInfo } from '../../lib/programDay';

type CheckKey = 'sange' | 'hotsugan' | 'ekou';

export default function NightScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [dayTitle, setDayTitle] = useState<string>('');
  const [nightQuestion, setNightQuestion] = useState<string>('');

  const [sangeDone, setSangeDone] = useState(false);
  const [hotsuganDone, setHotsuganDone] = useState(false);
  const [ekouDone, setEkouDone] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 今日のカードから「夜の問い」を表示（実践に接続させる）
      const info = await getProgramDayInfo();
      const card = getDayCard(info.dayNumber);
      setDayTitle(card.title);
      setNightQuestion(card.nightQuestion);

      // 今日の夜ログがあれば復元
      const saved = await getNightLog();
      if (saved) {
        setSangeDone(saved.sangeDone);
        setHotsuganDone(saved.hotsuganDone);
        setEkouDone(saved.ekouDone);
        setNote(saved.note ?? '');
      }
    } catch {
      setError('夜の記録の読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const complete = useMemo(() => {
    return isNightComplete({
      dateISO: 'today',
      sangeDone,
      hotsuganDone,
      ekouDone,
      note,
      savedAtISO: '',
    });
  }, [sangeDone, hotsuganDone, ekouDone, note]);

  const toggle = (k: CheckKey) => {
    if (k === 'sange') setSangeDone((v) => !v);
    if (k === 'hotsugan') setHotsuganDone((v) => !v);
    if (k === 'ekou') setEkouDone((v) => !v);
  };

  const Item = ({
    title,
    desc,
    checked,
    onPress,
  }: {
    title: string;
    desc: string;
    checked: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: checked }}
      style={[
        {
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#ddd',
          backgroundColor: '#fff',
        },
        checked && {
          borderColor: '#000',
          borderWidth: 2,
        },
      ]}
    >
      <Text style={{ fontSize: 16, fontWeight: checked ? '700' : '600' }}>
        {checked ? '✅ ' : '⬜️ '}
        {title}
      </Text>
      <Text style={{ marginTop: 6, opacity: 0.75, lineHeight: 20 }}>{desc}</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Night（夜のしめ）</Text>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ opacity: 0.7 }}>今日の学び</Text>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>{dayTitle}</Text>

        <Text style={{ marginTop: 8, fontWeight: '700' }}>夜の問い</Text>
        <Text style={{ lineHeight: 20 }}>{nightQuestion}</Text>

        <Text style={{ marginTop: 10, opacity: 0.7 }}>
          状態：{complete ? '完了 ✅' : '未完了'}
        </Text>
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>3ステップ（短くでOK）</Text>

        <Item
          title="懺悔（ざんげ）"
          desc="今日のズレを一つだけ認める。言い訳しない。責めない。"
          checked={sangeDone}
          onPress={() => toggle('sange')}
        />
        <Item
          title="発願（ほつがん）"
          desc="明日の一手を一つ決める。小さく・具体的に。"
          checked={hotsuganDone}
          onPress={() => toggle('hotsugan')}
        />
        <Item
          title="回向（えこう）"
          desc="今日の善いことを、自分だけに閉じずに回す（誰かの安寧を願う）。"
          checked={ekouDone}
          onPress={() => toggle('ekou')}
        />
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>ひとこと（任意）</Text>
        <Text style={{ opacity: 0.7 }}>
          ※長文不要。1行でもOK。空でもOK。
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="例：言い方がきつかった。明日は一呼吸おく。"
          multiline
          style={{
            minHeight: 80,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 12,
            padding: 12,
            textAlignVertical: 'top',
            backgroundColor: '#fff',
          }}
        />
      </View>

      <Pressable
        onPress={async () => {
          try {
            await setNightLog({ sangeDone, hotsuganDone, ekouDone, note });
            router.replace('/'); // Homeへ戻る
          } catch {
            setError(
              '保存に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
            );
          }
        }}
        style={{ padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#000' }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>夜のしめを保存して戻る</Text>
      </Pressable>

      <Pressable
        onPress={async () => {
          try {
            await clearNightLog();
            setSangeDone(false);
            setHotsuganDone(false);
            setEkouDone(false);
            setNote('');
          } catch {
            setError(
              '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
            );
          }
        }}
        style={{ padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#ddd' }}
      >
        <Text style={{ fontWeight: '700' }}>今日の夜チェックをリセット</Text>
      </Pressable>

      <Text style={{ opacity: 0.6 }}>
        ※ アクセシビリティ対応として選択状態を読み上げできるようにしています。
      </Text>
    </ScrollView>
  );
}

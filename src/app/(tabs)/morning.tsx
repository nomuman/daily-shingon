
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import ErrorState from '../../components/ErrorState';
import { clearMorningLog, getMorningLog, isMorningComplete, setMorningLog } from '../../lib/morningLog';

type CheckKey = 'body' | 'speech' | 'mind';

export default function MorningScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [bodyDone, setBodyDone] = useState(false);
  const [speechDone, setSpeechDone] = useState(false);
  const [mindDone, setMindDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const saved = await getMorningLog();
      if (saved) {
        setBodyDone(saved.bodyDone);
        setSpeechDone(saved.speechDone);
        setMindDone(saved.mindDone);
      }
    } catch {
      setError('朝の記録の読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const complete = useMemo(() => {
    return isMorningComplete({
      dateISO: 'today',
      bodyDone,
      speechDone,
      mindDone,
      savedAtISO: '',
    });
  }, [bodyDone, speechDone, mindDone]);

  const toggle = (k: CheckKey) => {
    if (k === 'body') setBodyDone((v) => !v);
    if (k === 'speech') setSpeechDone((v) => !v);
    if (k === 'mind') setMindDone((v) => !v);
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
  }) => {
    return (
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
  };

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
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Morning（朝の整え）</Text>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontWeight: '700' }}>今日の方針</Text>
        <Text style={{ lineHeight: 20 }}>
          まず「身・口・意」を整える。完璧じゃなくていい。できた分だけでOK。
        </Text>
        <Text style={{ marginTop: 6, opacity: 0.7 }}>
          状態：{complete ? '完了 ✅' : '未完了'}
        </Text>
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>チェック（3つ）</Text>

        <Item
          title="身（からだ）"
          desc="姿勢を整える。深呼吸をひとつ。丁寧に動く。"
          checked={bodyDone}
          onPress={() => toggle('body')}
        />
        <Item
          title="口（ことば）"
          desc="ひとつだけ、やさしい言葉を選ぶ。短く、丁寧に。"
          checked={speechDone}
          onPress={() => toggle('speech')}
        />
        <Item
          title="意（こころ）"
          desc="焦りを一度おく。いまの一手に心を置く。"
          checked={mindDone}
          onPress={() => toggle('mind')}
        />
      </View>

      <Pressable
        onPress={async () => {
          try {
            await setMorningLog({ bodyDone, speechDone, mindDone });
            router.replace('/'); // Homeへ戻る
          } catch {
            setError(
              '保存に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
            );
          }
        }}
        style={{ padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#000' }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>朝の整えを保存して戻る</Text>
      </Pressable>

      <Pressable
        onPress={async () => {
          try {
            await clearMorningLog();
            setBodyDone(false);
            setSpeechDone(false);
            setMindDone(false);
          } catch {
            setError(
              '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
            );
          }
        }}
        style={{ padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#ddd' }}
      >
        <Text style={{ fontWeight: '700' }}>今日の朝チェックをリセット</Text>
      </Pressable>
    </ScrollView>
  );
}

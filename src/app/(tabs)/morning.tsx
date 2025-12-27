
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { clearMorningLog, getMorningLog, isMorningComplete, setMorningLog } from '../../lib/morningLog';

type CheckKey = 'body' | 'speech' | 'mind';

export default function MorningScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [bodyDone, setBodyDone] = useState(false);
  const [speechDone, setSpeechDone] = useState(false);
  const [mindDone, setMindDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await getMorningLog();
        if (saved) {
          setBodyDone(saved.bodyDone);
          setSpeechDone(saved.speechDone);
          setMindDone(saved.mindDone);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          await setMorningLog({ bodyDone, speechDone, mindDone });
          router.replace('/'); // Homeへ戻る
        }}
        style={{ padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#000' }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>朝の整えを保存して戻る</Text>
      </Pressable>

      <Pressable
        onPress={async () => {
          await clearMorningLog();
          setBodyDone(false);
          setSpeechDone(false);
          setMindDone(false);
        }}
        style={{ padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#ddd' }}
      >
        <Text style={{ fontWeight: '700' }}>今日の朝チェックをリセット</Text>
      </Pressable>
    </ScrollView>
  );
}

import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorState from '../../components/ErrorState';
import {
  clearMorningLog,
  getMorningLog,
  isMorningComplete,
  setMorningLog,
} from '../../lib/morningLog';
import { cardShadow, theme } from '../../ui/theme';

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
      setError(
        '朝の記録の読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
      );
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
        style={({ pressed }) => [
          styles.checkItem,
          checked && styles.checkItemSelected,
          pressed && styles.checkItemPressed,
        ]}
      >
        <Text style={[styles.checkTitle, checked && styles.checkTitleSelected]}>
          {checked ? '✅ ' : '⬜️ '}
          {title}
        </Text>
        <Text style={styles.checkDesc}>{desc}</Text>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Morning（朝の整え）</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>今日の方針</Text>
          <Text style={styles.bodyText}>
            まず「身・口・意」を整える。完璧じゃなくていい。できた分だけでOK。
          </Text>
          <Text style={styles.statusText}>状態：{complete ? '完了 ✅' : '未完了'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>チェック（3つ）</Text>

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
              router.replace('/');
            } catch {
              setError(
                '保存に失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
              );
            }
          }}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>朝の整えを保存して戻る</Text>
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
                '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
              );
            }
          }}
          style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
        >
          <Text style={styles.ghostButtonText}>今日の朝チェックをリセット</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
    gap: theme.spacing.md,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: theme.font.display,
    color: theme.colors.ink,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
    ...cardShadow,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  bodyText: {
    lineHeight: 20,
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  statusText: {
    marginTop: 6,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  checkItem: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  checkItemSelected: {
    borderColor: theme.colors.ink,
    borderWidth: 2,
  },
  checkItemPressed: {
    opacity: 0.85,
  },
  checkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  checkTitleSelected: {
    fontWeight: '700',
  },
  checkDesc: {
    marginTop: 6,
    color: theme.colors.inkMuted,
    lineHeight: 20,
    fontFamily: theme.font.body,
  },
  primaryButton: {
    minHeight: 48,
    paddingHorizontal: 16,
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
    minHeight: 46,
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

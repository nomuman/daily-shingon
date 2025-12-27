import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorState from '../../components/ErrorState';
import { getDayCard } from '../../content/curriculum30.ja';
import { clearNightLog, getNightLog, isNightComplete, setNightLog } from '../../lib/nightLog';
import { getProgramDayInfo } from '../../lib/programDay';
import { cardShadow, theme } from '../../ui/theme';

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
      const info = await getProgramDayInfo();
      const card = getDayCard(info.dayNumber);
      setDayTitle(card.title);
      setNightQuestion(card.nightQuestion);

      const saved = await getNightLog();
      if (saved) {
        setSangeDone(saved.sangeDone);
        setHotsuganDone(saved.hotsuganDone);
        setEkouDone(saved.ekouDone);
        setNote(saved.note ?? '');
      }
    } catch {
      setError(
        '夜の記録の読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
      );
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
        <Text style={styles.title}>Night（夜のしめ）</Text>

        <View style={styles.card}>
          <Text style={styles.kicker}>今日の学び</Text>
          <Text style={styles.cardTitle}>{dayTitle}</Text>

          <Text style={styles.sectionTitle}>夜の問い</Text>
          <Text style={styles.bodyText}>{nightQuestion}</Text>

          <Text style={styles.statusText}>状態：{complete ? '完了 ✅' : '未完了'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3ステップ（短くでOK）</Text>

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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ひとこと（任意）</Text>
          <Text style={styles.mutedText}>※長文不要。1行でもOK。空でもOK。</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="例：言い方がきつかった。明日は一呼吸おく。"
            placeholderTextColor={theme.colors.inkMuted}
            multiline
            style={styles.noteInput}
          />
        </View>

        <Pressable
          onPress={async () => {
            try {
              await setNightLog({ sangeDone, hotsuganDone, ekouDone, note });
              router.replace('/');
            } catch {
              setError(
                '保存に失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
              );
            }
          }}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>夜のしめを保存して戻る</Text>
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
                '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
              );
            }
          }}
          style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
        >
          <Text style={styles.ghostButtonText}>今日の夜チェックをリセット</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          ※ アクセシビリティ対応として選択状態を読み上げできるようにしています。
        </Text>
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
  kicker: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
    ...cardShadow,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
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
  mutedText: {
    color: theme.colors.inkMuted,
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
  noteInput: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 12,
    textAlignVertical: 'top',
    backgroundColor: theme.colors.surface,
    color: theme.colors.ink,
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
  footerNote: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
});

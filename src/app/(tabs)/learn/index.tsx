import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorState from '../../../components/ErrorState';
import { curriculum30Ja, getDayCard } from '../../../content/curriculum30.ja';
import { getProgramDayInfo } from '../../../lib/programDay';
import { getTodayActionSelection, setTodayActionSelection } from '../../../lib/todayLog';
import type { CurriculumDay, SanmitsuKey } from '../../../types/curriculum';
import { cardShadow, theme } from '../../../ui/theme';

type SelectedAction = {
  key: SanmitsuKey;
  text: string;
};

export default function LearnScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<{ dayNumber: number; isComplete: boolean } | null>(null);
  const [card, setCard] = useState<CurriculumDay | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<SelectedAction | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getProgramDayInfo();
      setDayInfo({ dayNumber: info.dayNumber, isComplete: info.isComplete });

      const c = getDayCard(info.dayNumber);
      setCard(c);

      const saved = await getTodayActionSelection();
      if (saved) {
        setSelected({ key: saved.selectedKey, text: saved.selectedText });
      } else {
        const recommended = c.actionOptions.find((o) => o.key === c.recommendedActionKey);
        const fallbackText = recommended?.text ?? c.actionOptions[0]?.text ?? '';
        setSelected({ key: c.recommendedActionKey, text: fallbackText });
      }
    } catch {
      setError(
        '学びデータの読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sourceLinks = useMemo(() => {
    if (!card?.sources?.length) return [];
    return card.sources
      .map((id) => ({ id, url: curriculum30Ja.sourceIndex[id] }))
      .filter((x) => !!x.url);
  }, [card]);

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

  if (!card || !dayInfo || !selected) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>今日のカードを読み込めなかった。</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Day {dayInfo.dayNumber} / 30</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.bodyText}>{card.learn}</Text>

          {!!card.example && <Text style={styles.mutedText}>例：{card.example}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>今日の行い（1つ選ぶ）</Text>

          {card.actionOptions.map((opt, idx) => {
            const isSelected = selected.key === opt.key && selected.text === opt.text;
            const isRecommended = opt.key === card.recommendedActionKey;

            return (
              <Pressable
                key={`${opt.key}-${idx}`}
                onPress={() => setSelected({ key: opt.key, text: opt.text })}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  ・[{opt.key}] {opt.text}
                </Text>

                <View style={styles.optionMeta}>
                  {isRecommended && <Text style={styles.optionTag}>おすすめ</Text>}
                  {isSelected && <Text style={styles.optionTag}>選択中</Text>}
                </View>
              </Pressable>
            );
          })}

          <Text style={styles.footnote}>※おすすめは目安。今日はあなたの感覚で選んでOK。</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>夜の問い</Text>
          <Text style={styles.bodyText}>{card.nightQuestion}</Text>
        </View>

        {!!sourceLinks.length && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>参考</Text>
            {sourceLinks.map((s) => (
              <Text key={s.id} style={styles.sourceItem}>
                ・{s.id}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>さらに学ぶ</Text>
          <Text style={styles.mutedText}>カードや用語集を一覧で読む。</Text>
          <View style={styles.linkRow}>
            <Pressable
              onPress={() => router.push('/learn/cards')}
              style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
            >
              <Text style={styles.linkButtonText}>学びカード</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/learn/glossary')}
              style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
            >
              <Text style={styles.linkButtonText}>用語集</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={async () => {
            try {
              await setTodayActionSelection({
                selectedKey: selected.key,
                selectedText: selected.text,
              });
              router.replace('/');
            } catch {
              setError(
                '保存に失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
              );
            }
          }}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>今日はこれでいく</Text>
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
  emptyState: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
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
  cardTitle: {
    fontSize: 18,
    fontFamily: theme.font.display,
    color: theme.colors.ink,
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
    opacity: 0.75,
    lineHeight: 20,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  option: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionSelected: {
    borderColor: theme.colors.ink,
    borderWidth: 2,
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionText: {
    fontWeight: '500',
    lineHeight: 20,
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  optionTextSelected: {
    fontWeight: '700',
  },
  optionMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  optionTag: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  footnote: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  sourceItem: {
    opacity: 0.8,
    color: theme.colors.inkMuted,
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
  linkRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  linkButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  linkButtonPressed: {
    opacity: 0.85,
  },
  linkButtonText: {
    color: theme.colors.ink,
    fontFamily: theme.font.body,
    fontWeight: '600',
  },
});

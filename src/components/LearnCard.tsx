import { StyleSheet, Text, View } from 'react-native';

import type { CurriculumDay } from '../types/curriculum';
import { cardShadow, theme } from '../ui/theme';

type SourceLink = {
  id: string;
};

type LearnCardProps = {
  dayNumber: number;
  isComplete?: boolean;
  card: CurriculumDay;
  sourceLinks?: SourceLink[];
};

export default function LearnCard({ dayNumber, isComplete, card, sourceLinks }: LearnCardProps) {
  return (
    <View style={styles.stack}>
      <Text style={styles.title}>Day {dayNumber} / 30</Text>

      {isComplete && (
        <Text style={styles.notice}>
          30日を完走した。ここからは薄く長く。必要なら開始日をリセットしてもう一周もできる。
        </Text>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.bodyText}>{card.learn}</Text>

        {!!card.example && <Text style={styles.mutedText}>例：{card.example}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>今日の行い（1つ選ぶ）</Text>
        {card.actionOptions.map((opt, idx) => (
          <View key={`${opt.key}-${idx}`} style={styles.optionRow}>
            <Text style={opt.key === card.recommendedActionKey ? styles.optionTextStrong : styles.optionText}>
              ・[{opt.key}] {opt.text}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>夜の問い</Text>
        <Text style={styles.bodyText}>{card.nightQuestion}</Text>
      </View>

      {!!sourceLinks?.length && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>参考</Text>
          {sourceLinks.map((s) => (
            <Text key={s.id} style={styles.sourceItem}>
              ・{s.id}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.font.display,
    color: theme.colors.ink,
  },
  notice: {
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
  optionRow: {
    paddingVertical: 8,
  },
  optionText: {
    fontWeight: '400',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  optionTextStrong: {
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  sourceItem: {
    opacity: 0.8,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
});

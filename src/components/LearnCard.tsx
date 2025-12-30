/**
 * Purpose: Presentational component for a daily learn card. / 目的: 1日分の学びカード表示コンポーネント。
 * Responsibilities: render learn text, action options, night question, and sources. / 役割: 学び本文・行い候補・夜の問い・出典を表示。
 * Inputs: day number, completion flag, card data, optional source links. / 入力: 日数、完了フラグ、カードデータ、任意の出典リンク。
 * Outputs: stacked card UI sections. / 出力: 積み重ねカードUI。
 * Dependencies: i18n copy, theme tokens, curriculum types. / 依存: i18n文言、テーマトークン、カリキュラム型。
 * Side effects: none. / 副作用: なし。
 * Edge cases: missing optional example/sources. / 例外: 例/出典が未指定。
 */
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import type { CurriculumDay } from '../types/curriculum';
import { useThemedStyles } from '../ui/theme';

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
  const { t } = useTranslation('common');
  const styles = useThemedStyles((theme, cardShadow) =>
    StyleSheet.create({
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
    }),
  );

  return (
    <View style={styles.stack}>
      <Text style={styles.title}>{t('learn.dayLabel', { day: dayNumber, total: 30 })}</Text>

      {isComplete && <Text style={styles.notice}>{t('learn.completeNotice')}</Text>}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.bodyText}>{card.learn}</Text>

        {!!card.example && (
          <Text style={styles.mutedText}>{t('learn.example', { text: card.example })}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('learn.actionTitle')}</Text>
        {card.actionOptions.map((opt, idx) => (
          <View key={`${opt.key}-${idx}`} style={styles.optionRow}>
            <Text
              style={
                opt.key === card.recommendedActionKey ? styles.optionTextStrong : styles.optionText
              }
            >
              {t('learn.actionOption', { key: opt.key, text: opt.text })}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('learn.nightQuestion')}</Text>
        <Text style={styles.bodyText}>{card.nightQuestion}</Text>
      </View>

      {!!sourceLinks?.length && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('learn.sources')}</Text>
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

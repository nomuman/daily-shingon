/**
 * Purpose: Glossary term detail screen. / 目的: 用語詳細画面。
 * Responsibilities: resolve term data and render definition, notes, related terms, and sources. / 役割: 用語データ解決、定義/補足/関連/出典の表示。
 * Inputs: route param termId, glossary data, translations. / 入力: termIdパラメータ、用語集データ、翻訳文言。
 * Outputs: detailed term UI. / 出力: 用語詳細UI。
 * Dependencies: glossary content loaders, Expo Router params, i18n. / 依存: 用語集ローダー、Expo Routerパラメータ、i18n。
 * Side effects: none. / 副作用: なし。
 * Edge cases: missing termId or term not found. / 例外: termId未指定、用語未発見。
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useTranslation } from 'react-i18next';
import BackButton from '../../../../components/BackButton';
import Screen from '../../../../components/Screen';
import SurfaceCard from '../../../../components/SurfaceCard';
import { getGlossary, getGlossaryEntry } from '../../../../content/glossary';
import { useContentLang } from '../../../../content/useContentLang';
import { useResponsiveLayout } from '../../../../ui/responsive';
import { useThemedStyles, type Theme } from '../../../../ui/theme';

export default function GlossaryDetailScreen() {
  const { t } = useTranslation('common');
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();
  const lang = useContentLang();
  const { termId } = useLocalSearchParams<{ termId?: string | string[] }>();
  const resolvedTermId = Array.isArray(termId) ? termId[0] : termId;
  const glossary = getGlossary(lang);
  const entry = resolvedTermId ? getGlossaryEntry(lang, resolvedTermId) : undefined;

  // Guard against unknown term IDs. / 不明なtermIdをガード。
  if (!entry) {
    return (
      <Screen edges={['top']}>
        <View style={styles.emptyWrap}>
          <BackButton style={styles.backButton} />
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {t('glossary.termNotFound', { termId: resolvedTermId ?? t('common.unknown') })}
            </Text>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <BackButton />
        <View style={styles.header}>
          <Text style={styles.title}>{entry.term}</Text>
          <Text style={styles.meta}>
            {entry.reading ? `${entry.reading} ・ ` : ''}
            {entry.category ?? ''}
            {entry.level ? ` ・ ${levelLabel(t, entry.level)}` : ''}
          </Text>
        </View>

        <SurfaceCard style={styles.card}>
          <Text style={styles.sectionTitle}>{t('glossary.short')}</Text>
          <Text style={styles.bodyText}>{entry.short}</Text>
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <Text style={styles.sectionTitle}>{t('glossary.definition')}</Text>
          <Text style={styles.bodyText}>{entry.definition}</Text>
        </SurfaceCard>

        {!!entry.notes && (
          <SurfaceCard style={styles.card}>
            <Text style={styles.sectionTitle}>{t('glossary.notes')}</Text>
            <Text style={styles.bodyText}>{entry.notes}</Text>
          </SurfaceCard>
        )}

        {!!entry.see_also?.length && (
          <SurfaceCard style={styles.card}>
            <Text style={styles.sectionTitle}>{t('glossary.related')}</Text>
            {entry.see_also.map((id) => (
              <Text key={id} style={styles.bodyText}>
                ・{id}
              </Text>
            ))}
          </SurfaceCard>
        )}

        <SurfaceCard style={styles.card}>
          <Text style={styles.sectionTitle}>{t('glossary.sources')}</Text>
          {entry.sources.map((key) => {
            const ref = glossary.bibliography?.[key];
            return (
              <Text key={key} style={styles.bodyText}>
                ・{key}
                {ref?.title ? `：${ref.title}` : ''}
                {ref?.url ? `（${ref.url}）` : ''}
              </Text>
            );
          })}
        </SurfaceCard>
      </ScrollView>
    </Screen>
  );
}

// Map level enum to i18n label. / レベル列挙をi18nラベルに変換。
function levelLabel(t: (key: string) => string, level: 'beginner' | 'intermediate' | 'advanced') {
  switch (level) {
    case 'beginner':
      return t('glossary.level.beginner');
    case 'intermediate':
      return t('glossary.level.intermediate');
    case 'advanced':
      return t('glossary.level.advanced');
  }
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    backButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
    },
    emptyWrap: {
      flex: 1,
    },
    screen: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    content: {
      padding: theme.spacing.lg,
      paddingBottom: 40,
      gap: theme.spacing.md,
    },
    header: {
      gap: 6,
    },
    title: {
      fontSize: 22,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
      letterSpacing: 0.4,
      lineHeight: 30,
    },
    meta: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    card: {
      borderRadius: theme.radius.lg,
      gap: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    bodyText: {
      lineHeight: 22,
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    emptyState: {
      padding: theme.spacing.lg,
    },
    emptyText: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
  });

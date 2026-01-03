/**
 * Purpose: Card detail screen for a specific learn/practice card. / 目的: 学び/実践カード詳細画面。
 * Responsibilities: resolve pack + card, render sections, and show references. / 役割: パック/カード解決、各セクション描画、参照表示。
 * Inputs: route params (packId/cardId), content data, translations. / 入力: ルートパラメータ、コンテンツデータ、翻訳文言。
 * Outputs: detailed card UI. / 出力: 詳細UI。
 * Dependencies: content loaders, Expo Router params, themed styles, i18n. / 依存: コンテンツローダー、Expo Routerパラメータ、テーマスタイル、i18n。
 * Side effects: none. / 副作用: なし。
 * Edge cases: missing pack/card IDs, missing optional fields. / 例外: packId/cardId未指定、任意項目欠落。
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useTranslation } from 'react-i18next';
import BackButton from '../../../../../components/BackButton';
import Screen from '../../../../../components/Screen';
import SurfaceCard from '../../../../../components/SurfaceCard';
import { getCardById } from '../../../../../content/cards';
import { useContentLang } from '../../../../../content/useContentLang';
import { useResponsiveLayout } from '../../../../../ui/responsive';
import { useThemedStyles, type Theme } from '../../../../../ui/theme';

export default function CardDetailScreen() {
  const { t } = useTranslation('common');
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();
  const lang = useContentLang();
  const { packId, cardId } = useLocalSearchParams<{
    packId?: string | string[];
    cardId?: string | string[];
  }>();
  const resolvedPackId = Array.isArray(packId) ? packId[0] : packId;
  const resolvedCardId = Array.isArray(cardId) ? cardId[0] : cardId;

  // Resolve pack + card based on route params. / ルートパラメータからパック/カードを解決。
  const { pack, card } =
    resolvedPackId && resolvedCardId
      ? getCardById(lang, resolvedPackId, resolvedCardId)
      : { pack: undefined, card: undefined };

  // Guard against unknown IDs. / 不明IDをガード。
  if (!pack || !card) {
    return (
      <Screen edges={['top']}>
        <View style={styles.emptyWrap}>
          <BackButton style={styles.backButton} />
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {t('learnCards.cardNotFound', {
                packId: resolvedPackId ?? t('common.unknown'),
                cardId: resolvedCardId ?? t('common.unknown'),
              })}
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
          <Text style={styles.title}>{card.title}</Text>
          <Text style={styles.meta}>
            {pack.meta.title} ・{' '}
            {t(card.type === 'learn' ? 'learnCards.typeLearn' : 'learnCards.typePractice')} ・{' '}
            {levelLabel(t, card.level)}
          </Text>
        </View>

        <SurfaceCard style={styles.card}>
          <Text style={styles.sectionTitle}>{t('learnCards.summary')}</Text>
          <Text style={styles.bodyText}>{card.summary}</Text>
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <Text style={styles.sectionTitle}>{t('learnCards.body')}</Text>
          <Text style={styles.bodyText}>{card.body_md}</Text>
        </SurfaceCard>

        {!!card.tags?.length && (
          <SurfaceCard style={styles.card}>
            <Text style={styles.sectionTitle}>{t('learnCards.tags')}</Text>
            <Text style={styles.bodyText}>{card.tags.join(' / ')}</Text>
          </SurfaceCard>
        )}

        {!!card.micro_practice && (
          <SurfaceCard style={styles.card}>
            <Text style={styles.sectionTitle}>{t('learnCards.microPractice')}</Text>
            {!!card.micro_practice.morning && (
              <Text style={styles.bodyText}>
                {t('common.morning')}: {card.micro_practice.morning}
              </Text>
            )}
            {!!card.micro_practice.day && (
              <Text style={styles.bodyText}>
                {t('common.daytime')}: {card.micro_practice.day}
              </Text>
            )}
            {!!card.micro_practice.night && (
              <Text style={styles.bodyText}>
                {t('common.night')}: {card.micro_practice.night}
              </Text>
            )}
          </SurfaceCard>
        )}

        {!!card.reflection_questions?.length && (
          <SurfaceCard style={styles.card}>
            <Text style={styles.sectionTitle}>{t('learnCards.questions')}</Text>
            {card.reflection_questions.map((q, idx) => (
              <Text key={idx} style={styles.bodyText}>
                ・{q}
              </Text>
            ))}
          </SurfaceCard>
        )}

        <SurfaceCard style={styles.card}>
          <Text style={styles.sectionTitle}>{t('learnCards.sources')}</Text>
          {card.sources.map((key) => {
            const ref = pack.bibliography?.[key];
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
      return t('learnCards.level.beginner');
    case 'intermediate':
      return t('learnCards.level.intermediate');
    case 'advanced':
      return t('learnCards.level.advanced');
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
      color: theme.colors.ink,
      fontFamily: theme.font.bodyBold,
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

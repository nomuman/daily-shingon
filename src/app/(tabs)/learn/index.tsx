/**
 * Purpose: Daily learn screen that presents today's card and action selection. / 目的: 今日の学びカードと行い選択を表示する画面。
 * Responsibilities: load program day + card, resolve selected action, save selection, and link to learn lists. / 役割: 日数/カード読込、選択解決、保存、学び一覧への導線。
 * Inputs: curriculum content, stored selection, translations, theme tokens. / 入力: カリキュラム内容、保存選択、翻訳文言、テーマトークン。
 * Outputs: learn UI, selection persistence, and navigation to other learn routes. / 出力: 学びUI、選択保存、他ルート遷移。
 * Dependencies: content loaders, AsyncStorage-backed logs, Expo Router, i18n. / 依存: コンテンツローダー、AsyncStorageログ、Expo Router、i18n。
 * Side effects: reads/writes local storage; navigation on confirm. / 副作用: ストレージ読書き、確定時の遷移。
 * Edge cases: missing card, content load errors, save failures. / 例外: カード欠落、読込失敗、保存失敗。
 */
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import AppButton from '../../../components/AppButton';
import BackButton from '../../../components/BackButton';
import ErrorState from '../../../components/ErrorState';
import Screen from '../../../components/Screen';
import SurfaceCard from '../../../components/SurfaceCard';
import { getCurriculum30, getDayCard } from '../../../content/curriculum30';
import { useContentLang } from '../../../content/useContentLang';
import { getProgramDayInfo } from '../../../lib/programDay';
import type { TodayActionSelection } from '../../../lib/todayLog';
import { getTodayActionSelection, setTodayActionSelection } from '../../../lib/todayLog';
import type { CurriculumDay, SanmitsuKey } from '../../../types/curriculum';
import { useResponsiveLayout } from '../../../ui/responsive';
import { useTheme, useThemedStyles, type Theme } from '../../../ui/theme';

type SelectedAction = {
  key: SanmitsuKey;
  text: string;
};

// Choose a safe default action if nothing is saved yet. / 保存がない場合の安全なデフォルト選択。
const resolveFallbackAction = (card: CurriculumDay): SelectedAction => {
  const recommended = card.actionOptions.find((o) => o.key === card.recommendedActionKey);
  const fallback = card.actionOptions[0];
  return {
    key: recommended?.key ?? fallback?.key ?? card.recommendedActionKey,
    text: recommended?.text ?? fallback?.text ?? '',
  };
};

// Use saved selection if still valid; otherwise fall back to recommended/default. / 保存済みが有効なら使用、無効なら推薦/デフォルトへ。
const resolveSelectedAction = (
  card: CurriculumDay,
  saved: TodayActionSelection | null,
): SelectedAction => {
  if (saved) {
    const matched = card.actionOptions.find((o) => o.key === saved.selectedKey);
    if (matched) {
      return { key: matched.key, text: matched.text };
    }
  }
  return resolveFallbackAction(card);
};

export default function LearnScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();
  const contentLang = useContentLang();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dayInfo, setDayInfo] = useState<{ dayNumber: number; isComplete: boolean } | null>(null);
  const [card, setCard] = useState<CurriculumDay | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<SelectedAction | null>(null);

  const goBackOrHome = () => {
    if ('canGoBack' in router && typeof router.canGoBack === 'function') {
      if (router.canGoBack()) {
        router.back();
        return;
      }
      router.replace('/');
      return;
    }
    router.back();
  };

  // Fetch day info, card data, and saved selection. / 日数情報・カード・保存選択を取得。
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getProgramDayInfo();
      setDayInfo({ dayNumber: info.dayNumber, isComplete: info.isComplete });

      const c = getDayCard(contentLang, info.dayNumber);
      setCard(c);

      const saved = await getTodayActionSelection();
      setSelected(resolveSelectedAction(c, saved));
    } catch (err) {
      console.error('Failed to load learn screen data.', err);
      setError(t('errors.learnLoadFail'));
    } finally {
      setLoading(false);
    }
  }, [contentLang, t]);

  // Initial load + reload when language changes. / 初回ロード＋言語変更時の再読込。
  useEffect(() => {
    void load();
  }, [load]);

  // Resolve source IDs to URLs for display (if present). / 出典IDをURLへ解決（存在時）。
  const sourceLinks = useMemo(() => {
    if (!card?.sources?.length) return [];
    const curriculum = getCurriculum30(contentLang);
    return card.sources
      .map((id) => ({ id, url: curriculum.sourceIndex[id] }))
      .filter((x) => !!x.url);
  }, [card, contentLang]);

  // Loading/error/empty gates before rendering the main screen. / ロード・エラー・空状態の分岐。
  if (loading) {
    return (
      <Screen edges={['top']}>
        <View style={styles.loadingWrap}>
          <BackButton style={styles.backButton} />
          <View style={styles.loading}>
            <ActivityIndicator color={theme.colors.accent} />
          </View>
        </View>
      </Screen>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} showBack />;
  }

  if (!card || !dayInfo || !selected) {
    return (
      <Screen edges={['top']}>
        <View style={styles.emptyWrap}>
          <BackButton style={styles.backButton} />
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('learn.emptyCard')}</Text>
          </View>
        </View>
      </Screen>
    );
  }

  // Main learn content with action selection and confirmation. / 学び本体＋選択＋確定UI。
  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <BackButton />
        <Text style={styles.title}>
          {t('learn.dayLabel', { day: dayInfo.dayNumber, total: 30 })}
        </Text>

        <SurfaceCard style={styles.card}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.bodyText}>{card.learn}</Text>

          {!!card.example && (
            <Text style={styles.mutedText}>{t('learn.example', { text: card.example })}</Text>
          )}
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <View style={styles.ritualBar} />
          <Text style={styles.sectionTitle}>{t('learn.actionTitle')}</Text>

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
                  {t('learn.actionOption', { key: opt.key, text: opt.text })}
                </Text>

                <View style={styles.optionMeta}>
                  {isRecommended && <Text style={styles.optionTag}>{t('common.recommended')}</Text>}
                  {isSelected && <Text style={styles.optionTag}>{t('common.selected')}</Text>}
                </View>
              </Pressable>
            );
          })}

          <Text style={styles.footnote}>{t('learn.actionFootnote')}</Text>
        </SurfaceCard>

        <SurfaceCard style={styles.card} elevated={false} variant="muted">
          <Text style={styles.sectionTitle}>{t('learn.nightQuestion')}</Text>
          <Text style={styles.bodyText}>{card.nightQuestion}</Text>
        </SurfaceCard>

        {!!sourceLinks.length && (
          <SurfaceCard style={styles.card} elevated={false} variant="muted">
            <Text style={styles.sectionTitle}>{t('learn.sources')}</Text>
            {sourceLinks.map((s) => (
              <Text key={s.id} style={styles.sourceItem}>
                ・{s.id}
              </Text>
            ))}
          </SurfaceCard>
        )}

        <SurfaceCard style={styles.card} elevated={false} variant="muted">
          <Text style={styles.sectionTitle}>{t('learn.moreTitle')}</Text>
          <Text style={styles.mutedText}>{t('learn.moreBody')}</Text>
          <View style={styles.linkRow}>
            <AppButton
              label={t('learn.moreCards')}
              variant="ghost"
              size="sm"
              style={styles.linkButton}
              onPress={() => router.push('/learn/cards')}
            />
            <AppButton
              label={t('learn.moreGlossary')}
              variant="ghost"
              size="sm"
              style={styles.linkButton}
              onPress={() => router.push('/learn/glossary')}
            />
          </View>
        </SurfaceCard>

        <AppButton
          label={t('learn.confirmAction')}
          variant="primary"
          size="lg"
          loading={saving}
          disabled={saving}
          onPress={async () => {
            if (saving) return;
            setSaving(true);
            try {
              // Persist the user's "today action" selection. / 今日の行い選択を保存。
              await setTodayActionSelection({
                selectedKey: selected.key,
                selectedText: selected.text,
              });
              goBackOrHome();
            } catch (err) {
              console.error('Failed to save today action selection.', err);
              setError(t('errors.saveFail'));
            } finally {
              setSaving(false);
            }
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    content: {
      padding: theme.spacing.lg,
      paddingBottom: 40,
      gap: theme.spacing.md,
    },
    backButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
    },
    loadingWrap: {
      flex: 1,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyWrap: {
      flex: 1,
    },
    emptyState: {
      padding: theme.spacing.lg,
    },
    emptyText: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    title: {
      fontSize: 20,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
      letterSpacing: 0.4,
      lineHeight: 28,
    },
    card: {
      borderRadius: theme.radius.lg,
      gap: theme.spacing.sm,
    },
    cardTitle: {
      fontSize: 18,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
      letterSpacing: 0.3,
      lineHeight: 26,
    },
    sectionTitle: {
      fontSize: 16,
      color: theme.colors.ink,
      fontFamily: theme.font.bodyBold,
      letterSpacing: 0.2,
    },
    bodyText: {
      lineHeight: 22,
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    mutedText: {
      opacity: 0.75,
      lineHeight: 22,
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
      lineHeight: 22,
      color: theme.colors.ink,
      fontFamily: theme.font.bodyMedium,
    },
    optionTextSelected: {
      fontFamily: theme.font.bodyBold,
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
    ritualBar: {
      height: 3,
      width: 56,
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
      alignSelf: 'flex-start',
    },
    linkRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    linkButton: {
      flex: 1,
    },
  });

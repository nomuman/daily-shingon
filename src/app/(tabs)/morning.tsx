/**
 * Purpose: Morning check-in screen (body/speech/mind). / 目的: 朝のチェックイン画面（身・口・意）。
 * Responsibilities: load saved morning log, toggle checks, save/reset entries. / 役割: 朝ログ読込、チェック切替、保存/リセット。
 * Inputs: optional date param, stored morning log, translations. / 入力: 任意の日付パラメータ、保存済み朝ログ、翻訳文言。
 * Outputs: checklist UI + persistence actions. / 出力: チェックリストUIと保存アクション。
 * Dependencies: morning log storage, date utilities, Expo Router, i18n. / 依存: 朝ログストレージ、日付ユーティリティ、Expo Router、i18n。
 * Side effects: reads/writes storage; navigation back to home. / 副作用: ストレージ読み書き、ホームへの遷移。
 * Edge cases: missing date param, storage failures. / 例外: 日付未指定、ストレージ失敗。
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import AppButton from '../../components/AppButton';
import { AppIcon } from '../../components/AppIcon';
import BackButton from '../../components/BackButton';
import InlineTerm from '../../components/InlineTerm';
import Screen from '../../components/Screen';
import SurfaceCard from '../../components/SurfaceCard';
import { getDayCard } from '../../content/curriculum30';
import { useContentLang } from '../../content/useContentLang';
import { saveEntry, softDeleteEntry } from '../../features/entries/saveEntry';
import { parseISODateLocal, toISODateLocal } from '../../lib/date';
import ErrorState from '../../components/ErrorState';
import { clearLearnLog } from '../../lib/learnLog';
import {
  clearMorningLog,
  getMorningLog,
  isMorningComplete,
  setMorningLog,
} from '../../lib/morningLog';
import { getProgramDayInfo } from '../../lib/programDay';
import {
  clearTodayActionSelection,
  getTodayActionSelection,
  setTodayActionSelection,
  type TodayActionSelection,
} from '../../lib/todayLog';
import type { CurriculumDay, SanmitsuKey } from '../../types/curriculum';
import { useResponsiveLayout } from '../../ui/responsive';
import { useTheme, useThemedStyles, type Theme } from '../../ui/theme';

type CheckKey = 'body' | 'speech' | 'mind';
type SelectedAction = {
  key: SanmitsuKey;
  text: string;
};

const resolveFallbackAction = (card: CurriculumDay): SelectedAction => {
  const recommended = card.actionOptions.find((option) => option.key === card.recommendedActionKey);
  const fallback = card.actionOptions[0];
  return {
    key: recommended?.key ?? fallback?.key ?? card.recommendedActionKey,
    text: recommended?.text ?? fallback?.text ?? '',
  };
};

const resolveSelectedAction = (
  card: CurriculumDay,
  saved: TodayActionSelection | null,
): SelectedAction => {
  if (saved) {
    const matched = card.actionOptions.find((option) => option.key === saved.selectedKey);
    if (matched) {
      return { key: matched.key, text: matched.text };
    }
  }
  return resolveFallbackAction(card);
};

export default function MorningScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();
  const contentLang = useContentLang();
  const { date } = useLocalSearchParams<{ date?: string }>();

  // Resolve the target date (explicit param or today). / 対象日を解決（指定日または今日）。
  const dateParam = useMemo(() => (date ? parseISODateLocal(date) : null), [date]);
  const getTargetDate = useCallback(() => dateParam ?? new Date(), [dateParam]);

  const [loading, setLoading] = useState(true);
  const [bodyDone, setBodyDone] = useState(false);
  const [speechDone, setSpeechDone] = useState(false);
  const [mindDone, setMindDone] = useState(false);
  const [card, setCard] = useState<CurriculumDay | null>(null);
  const [selectedAction, setSelectedAction] = useState<SelectedAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerHaptic = () => {
    if (Platform.OS === 'web') return;
    void Haptics.selectionAsync();
  };

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

  // Load persisted morning check states for the target date. / 対象日の朝チェック状態を読込。
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getProgramDayInfo(getTargetDate());
      const dayCard = getDayCard(contentLang, info.dayNumber);
      setCard(dayCard);

      const saved = await getMorningLog(getTargetDate());
      if (saved) {
        setBodyDone(saved.bodyDone);
        setSpeechDone(saved.speechDone);
        setMindDone(saved.mindDone);
      }

      const savedAction = await getTodayActionSelection(getTargetDate());
      setSelectedAction(resolveSelectedAction(dayCard, savedAction));
    } catch (err) {
      console.error('Failed to load morning log.', err);
      setError(t('errors.morningLoadFail'));
    } finally {
      setLoading(false);
    }
  }, [contentLang, getTargetDate, t]);

  // Initial load. / 初回ロード。
  useEffect(() => {
    void load();
  }, [load]);

  // Derived completion status for the summary row. / サマリー表示用の完了状態。
  const complete = useMemo(() => {
    return isMorningComplete({
      dateISO: dateParam ? toISODateLocal(dateParam) : 'today',
      bodyDone,
      speechDone,
      mindDone,
      savedAtISO: '',
    });
  }, [bodyDone, dateParam, mindDone, speechDone]);

  // Toggle a single check item. / 単一チェックのトグル。
  const toggle = (k: CheckKey) => {
    if (k === 'body') setBodyDone((v) => !v);
    if (k === 'speech') setSpeechDone((v) => !v);
    if (k === 'mind') setMindDone((v) => !v);
  };

  // Reusable checklist row with icon + description. / アイコン＋説明付きのチェック行。
  const Item = ({
    title,
    desc,
    checked,
    onPress,
  }: {
    title: React.ReactNode;
    desc: string;
    checked: boolean;
    onPress: () => void;
  }) => {
    return (
      <Pressable
        onPress={() => {
          triggerHaptic();
          onPress();
        }}
        accessibilityRole="button"
        accessibilityState={{ selected: checked }}
        style={({ pressed }) => [
          styles.checkItem,
          checked && styles.checkItemSelected,
          pressed && styles.checkItemPressed,
        ]}
      >
        <View style={styles.checkTitleRow}>
          <AppIcon
            name={checked ? 'check' : 'uncheck'}
            size={18}
            color={checked ? theme.colors.accentDark : theme.colors.inkMuted}
          />
          <View style={[styles.ritualSeal, checked && styles.ritualSealActive]} />
          {typeof title === 'string' ? (
            <Text style={[styles.checkTitle, checked && styles.checkTitleSelected]}>{title}</Text>
          ) : (
            <View style={{ flex: 1 }}>{title}</View>
          )}
        </View>
        <Text style={styles.checkDesc}>{desc}</Text>
      </Pressable>
    );
  };

  // Loading/error gates before main UI. / ローディング・エラー時の分岐。
  if (loading) {
    return (
      <Screen edges={['top']}>
        <View style={styles.loadingWrap}>
          <BackButton style={styles.backButton} disabled={loading} />
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

  if (!card || !selectedAction) {
    return <ErrorState message={t('errors.dataLoadFail')} onRetry={load} showBack />;
  }

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <BackButton />
        <Text style={styles.title}>{t('morning.title')}</Text>

        <SurfaceCard style={styles.card} elevated={false} variant="muted">
          <Text style={styles.sectionTitle}>{t('morning.policyTitle')}</Text>
          <Text style={styles.bodyText}>{t('morning.policyBody')}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>
              {t('common.statusWithValue', {
                value: complete ? t('common.done') : t('common.incomplete'),
              })}
            </Text>
            <AppIcon
              name={complete ? 'check' : 'uncheck'}
              size={16}
              color={complete ? theme.colors.accentDark : theme.colors.inkMuted}
            />
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <View style={styles.ritualBar} />
          <Text style={styles.sectionTitle}>{t('morning.checkTitle')}</Text>

          <Item
            title={
              <InlineTerm termId="practice.sanmitsu_body" textStyle={styles.checkTitle}>
                {t('morning.check.body.title')}
              </InlineTerm>
            }
            desc={t('morning.check.body.desc')}
            checked={bodyDone}
            onPress={() => toggle('body')}
          />
          <Item
            title={
              <InlineTerm termId="practice.sanmitsu_speech" textStyle={styles.checkTitle}>
                {t('morning.check.speech.title')}
              </InlineTerm>
            }
            desc={t('morning.check.speech.desc')}
            checked={speechDone}
            onPress={() => toggle('speech')}
          />
          <Item
            title={
              <InlineTerm termId="practice.sanmitsu_mind" textStyle={styles.checkTitle}>
                {t('morning.check.mind.title')}
              </InlineTerm>
            }
            desc={t('morning.check.mind.desc')}
            checked={mindDone}
            onPress={() => toggle('mind')}
          />
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <View style={styles.ritualBar} />
          <Text style={styles.sectionTitle}>{t('morning.actionTitle')}</Text>
          <Text style={styles.bodyText}>{t('morning.actionBody')}</Text>

          {card.actionOptions.map((option, index) => {
            const isSelected =
              selectedAction.key === option.key && selectedAction.text === option.text;
            const isRecommended = option.key === card.recommendedActionKey;

            return (
              <Pressable
                key={`${option.key}-${index}`}
                onPress={() => setSelectedAction({ key: option.key, text: option.text })}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {t('learn.actionOption', { key: option.key, text: option.text })}
                </Text>
                <View style={styles.optionMeta}>
                  {isRecommended && <Text style={styles.optionTag}>{t('common.recommended')}</Text>}
                  {isSelected && <Text style={styles.optionTag}>{t('common.selected')}</Text>}
                </View>
              </Pressable>
            );
          })}

          <Text style={styles.footnote}>{t('morning.actionFootnote')}</Text>
        </SurfaceCard>

        <AppButton
          label={t('morning.saveButton')}
          variant="primary"
          size="lg"
          onPress={async () => {
            try {
              const entryDate = toISODateLocal(getTargetDate());
              // Persist morning log and return to previous screen. / 朝ログを保存して前画面へ戻る。
              await setMorningLog({ bodyDone, speechDone, mindDone, date: getTargetDate() });
              await setTodayActionSelection(
                {
                  selectedKey: selectedAction.key,
                  selectedText: selectedAction.text,
                },
                getTargetDate(),
              );
              await clearLearnLog(getTargetDate());
              void saveEntry({
                date: entryDate,
                slot: 'morning',
                bodyDone,
                speechDone,
                mindDone,
                actionPick: selectedAction.key,
              }).catch((err) => {
                console.warn('Failed to sync morning entry.', err);
              });
              goBackOrHome();
            } catch (err) {
              console.error('Failed to save morning log.', err);
              setError(t('errors.saveFail'));
            }
          }}
        />

        <AppButton
          label={t('morning.resetButton')}
          variant="ghost"
          onPress={async () => {
            try {
              const entryDate = toISODateLocal(getTargetDate());
              // Clear saved log and reset local toggles. / 保存ログを削除し、ローカル状態をリセット。
              await clearMorningLog(getTargetDate());
              await clearTodayActionSelection(getTargetDate());
              await clearLearnLog(getTargetDate());
              setBodyDone(false);
              setSpeechDone(false);
              setMindDone(false);
              setSelectedAction(resolveFallbackAction(card));
              void softDeleteEntry(entryDate, 'morning').catch((err) => {
                console.warn('Failed to sync morning deletion.', err);
              });
            } catch (err) {
              console.error('Failed to reset morning log.', err);
              setError(t('errors.updateFail'));
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
      paddingBottom: 74,
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
    statusText: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    statusRow: {
      marginTop: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
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
      backgroundColor: theme.colors.accentSoft,
    },
    checkItemPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
      backgroundColor: theme.colors.surfaceMuted,
    },
    checkTitle: {
      fontSize: 16,
      color: theme.colors.ink,
      fontFamily: theme.font.bodyMedium,
    },
    checkTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    checkTitleSelected: {
      fontFamily: theme.font.bodyBold,
    },
    ritualSeal: {
      width: 6,
      height: 6,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: theme.colors.inkMuted,
    },
    ritualSealActive: {
      borderColor: theme.colors.accentDark,
      backgroundColor: theme.colors.accentSoft,
    },
    ritualBar: {
      height: 3,
      width: 56,
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
      alignSelf: 'flex-start',
    },
    checkDesc: {
      marginTop: 6,
      color: theme.colors.inkMuted,
      lineHeight: 22,
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
      backgroundColor: theme.colors.surfaceMuted,
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
  });

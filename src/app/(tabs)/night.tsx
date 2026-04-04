/**
 * Purpose: Night reflection screen (repent / vow / dedicate + note). / 目的: 夜のしめ画面（懺悔/発願/回向＋メモ）。
 * Responsibilities: load day context, capture semantic night choices, and save/reset logs. / 役割: 当日文脈の読込、意味付きの夜選択取得、ログ保存/リセット。
 * Inputs: optional date param, program day info, saved night log, translations. / 入力: 任意の日付パラメータ、当日日数情報、保存済み夜ログ、翻訳文言。
 * Outputs: choice-based reflection UI and persistence actions. / 出力: 選択式の振り返りUIと保存アクション。
 * Dependencies: night log storage, curriculum content, Expo Router, i18n. / 依存: 夜ログストレージ、カリキュラム内容、Expo Router、i18n。
 * Side effects: reads/writes storage; navigation back to home. / 副作用: ストレージ読書き、ホームへの遷移。
 * Edge cases: legacy boolean-only logs keep completion state but lack detailed selections. / 例外: 旧booleanログは完了状態のみ保持し、詳細選択は欠ける。
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import AppButton from '../../components/AppButton';
import { AppIcon } from '../../components/AppIcon';
import BackButton from '../../components/BackButton';
import Screen from '../../components/Screen';
import SurfaceCard from '../../components/SurfaceCard';
import ErrorState from '../../components/ErrorState';
import { getDayCard } from '../../content/curriculum30';
import { useContentLang } from '../../content/useContentLang';
import { saveEntry, softDeleteEntry } from '../../features/entries/saveEntry';
import { parseISODateLocal, toISODateLocal } from '../../lib/date';
import { clearNightLog, getNightLog, isNightComplete, setNightLog } from '../../lib/nightLog';
import { getProgramDayInfo } from '../../lib/programDay';
import type { EntryEko, EntryPick } from '../../storage/entryStore.types';
import { useResponsiveLayout } from '../../ui/responsive';
import { useTheme, useThemedStyles, type Theme } from '../../ui/theme';

type SanmitsuChoice = Exclude<EntryPick, null>;
type EkoChoice = Exclude<EntryEko, null>;
type NightStyles = ReturnType<typeof createStyles>;

const sanmitsuChoices: SanmitsuChoice[] = ['body', 'speech', 'mind'];
const ekoChoices: EkoChoice[] = ['self', 'family', 'team', 'all'];

const ChoiceChip = ({
  label,
  selected,
  onPress,
  styles,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  styles: NightStyles;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    style={({ pressed }) => [
      styles.choiceChip,
      selected && styles.choiceChipSelected,
      pressed && styles.choiceChipPressed,
    ]}
  >
    <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
  </Pressable>
);

export default function NightScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();
  const contentLang = useContentLang();
  const { date } = useLocalSearchParams<{ date?: string }>();

  const dateParam = useMemo(() => (date ? parseISODateLocal(date) : null), [date]);
  const getTargetDate = useCallback(() => dateParam ?? new Date(), [dateParam]);

  const [loading, setLoading] = useState(true);
  const [dayTitle, setDayTitle] = useState('');
  const [nightQuestion, setNightQuestion] = useState('');
  const [sange, setSange] = useState<EntryPick>(null);
  const [hotsugan, setHotsugan] = useState<EntryPick>(null);
  const [ekou, setEkou] = useState<EntryEko>(null);
  const [legacySelectionMissing, setLegacySelectionMissing] = useState(false);
  const [note, setNote] = useState('');
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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getProgramDayInfo(getTargetDate());
      const card = getDayCard(contentLang, info.dayNumber);
      setDayTitle(card.title);
      setNightQuestion(card.nightQuestion);

      const saved = await getNightLog(getTargetDate());
      if (saved) {
        setSange(saved.sange ?? null);
        setHotsugan(saved.hotsugan ?? null);
        setEkou(saved.ekou ?? null);
        setLegacySelectionMissing(
          isNightComplete(saved) && (!saved.sange || !saved.hotsugan || !saved.ekou),
        );
        setNote(saved.note ?? '');
      } else {
        setSange(null);
        setHotsugan(null);
        setEkou(null);
        setLegacySelectionMissing(false);
        setNote('');
      }
    } catch (err) {
      console.error('Failed to load night log.', err);
      setError(t('errors.nightLoadFail'));
    } finally {
      setLoading(false);
    }
  }, [contentLang, getTargetDate, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const complete = useMemo(() => {
    return isNightComplete({
      dateISO: dateParam ? toISODateLocal(dateParam) : 'today',
      sangeDone: !!sange,
      hotsuganDone: !!hotsugan,
      ekouDone: !!ekou,
      sange,
      hotsugan,
      ekou,
      note,
      savedAtISO: '',
    });
  }, [dateParam, ekou, hotsugan, note, sange]);

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

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <BackButton />
        <Text style={styles.title}>{t('night.title')}</Text>

        <SurfaceCard style={styles.card} elevated={false} variant="muted">
          <Text style={styles.kicker}>{t('night.todayLearn')}</Text>
          <Text style={styles.cardTitle}>{dayTitle}</Text>

          <Text style={styles.sectionTitle}>{t('night.nightQuestion')}</Text>
          <Text style={styles.bodyText}>{nightQuestion}</Text>

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

          {legacySelectionMissing && (
            <SurfaceCard style={styles.legacyCard} elevated={false} variant="outlined" padding="sm">
              <Text style={styles.legacyText}>{t('night.legacyNote')}</Text>
            </SurfaceCard>
          )}
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <View style={styles.ritualBar} />
          <Text style={styles.sectionTitle}>{t('night.stepsTitle')}</Text>

          <View style={styles.stepBlock}>
            <Text style={styles.fieldTitle}>{t('night.steps.sange.title')}</Text>
            <Text style={styles.fieldPrompt}>{t('night.fields.sangePrompt')}</Text>
            <View style={styles.choiceWrap}>
              {sanmitsuChoices.map((choice) => (
                <ChoiceChip
                  key={choice}
                  label={t(`night.choices.${choice}`)}
                  selected={sange === choice}
                  onPress={() => {
                    triggerHaptic();
                    setSange(choice);
                    setLegacySelectionMissing(false);
                  }}
                  styles={styles}
                />
              ))}
            </View>
            <Text style={styles.mutedText}>{t('night.steps.sange.desc')}</Text>
          </View>

          <View style={styles.stepBlock}>
            <Text style={styles.fieldTitle}>{t('night.steps.hotsugan.title')}</Text>
            <Text style={styles.fieldPrompt}>{t('night.fields.hotsuganPrompt')}</Text>
            <View style={styles.choiceWrap}>
              {sanmitsuChoices.map((choice) => (
                <ChoiceChip
                  key={choice}
                  label={t(`night.choices.${choice}`)}
                  selected={hotsugan === choice}
                  onPress={() => {
                    triggerHaptic();
                    setHotsugan(choice);
                    setLegacySelectionMissing(false);
                  }}
                  styles={styles}
                />
              ))}
            </View>
            <Text style={styles.mutedText}>{t('night.steps.hotsugan.desc')}</Text>
          </View>

          <View style={styles.stepBlock}>
            <Text style={styles.fieldTitle}>{t('night.steps.ekou.title')}</Text>
            <Text style={styles.fieldPrompt}>{t('night.fields.ekouPrompt')}</Text>
            <View style={styles.choiceWrap}>
              {ekoChoices.map((choice) => (
                <ChoiceChip
                  key={choice}
                  label={t(`night.choices.${choice}`)}
                  selected={ekou === choice}
                  onPress={() => {
                    triggerHaptic();
                    setEkou(choice);
                    setLegacySelectionMissing(false);
                  }}
                  styles={styles}
                />
              ))}
            </View>
            <Text style={styles.mutedText}>{t('night.steps.ekou.desc')}</Text>
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.card} elevated={false} variant="muted">
          <Text style={styles.sectionTitle}>{t('night.noteTitle')}</Text>
          <Text style={styles.mutedText}>{t('night.noteHint')}</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t('night.notePlaceholder')}
            placeholderTextColor={theme.colors.inkMuted}
            multiline
            style={styles.noteInput}
          />
        </SurfaceCard>

        <AppButton
          label={t('night.saveButton')}
          variant="primary"
          size="lg"
          onPress={async () => {
            try {
              const entryDate = toISODateLocal(getTargetDate());
              const noteCiphertext = note.trim() ? note.trim() : null;
              await setNightLog({
                sange,
                hotsugan,
                ekou,
                note,
                date: getTargetDate(),
              });
              void saveEntry({
                date: entryDate,
                slot: 'night',
                bodyDone: !!sange,
                speechDone: !!hotsugan,
                mindDone: !!ekou,
                sange,
                hatsugan: hotsugan,
                eko: ekou,
                noteCiphertext,
                noteVersion: 1,
              }).catch((err) => {
                console.warn('Failed to sync night entry.', err);
              });
              goBackOrHome();
            } catch (err) {
              console.error('Failed to save night log.', err);
              setError(t('errors.saveFail'));
            }
          }}
        />

        <AppButton
          label={t('night.resetButton')}
          variant="ghost"
          onPress={async () => {
            try {
              const entryDate = toISODateLocal(getTargetDate());
              await clearNightLog(getTargetDate());
              setSange(null);
              setHotsugan(null);
              setEkou(null);
              setLegacySelectionMissing(false);
              setNote('');
              void softDeleteEntry(entryDate, 'night').catch((err) => {
                console.warn('Failed to sync night deletion.', err);
              });
            } catch (err) {
              console.error('Failed to reset night log.', err);
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
    title: {
      fontSize: 20,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
      letterSpacing: 0.4,
      lineHeight: 28,
    },
    kicker: {
      fontSize: 12,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    card: {
      borderRadius: theme.radius.lg,
      gap: theme.spacing.sm,
    },
    legacyCard: {
      marginTop: theme.spacing.xs,
    },
    legacyText: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      lineHeight: 20,
    },
    cardTitle: {
      fontSize: 16,
      color: theme.colors.ink,
      fontFamily: theme.font.bodyBold,
      lineHeight: 22,
    },
    sectionTitle: {
      fontSize: 16,
      color: theme.colors.ink,
      fontFamily: theme.font.bodyBold,
    },
    fieldTitle: {
      fontSize: 15,
      color: theme.colors.ink,
      fontFamily: theme.font.bodyBold,
    },
    fieldPrompt: {
      color: theme.colors.ink,
      lineHeight: 22,
      fontFamily: theme.font.body,
    },
    bodyText: {
      lineHeight: 22,
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    mutedText: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      lineHeight: 20,
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
    stepBlock: {
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
    },
    choiceWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    choiceChip: {
      minHeight: 44,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    choiceChipSelected: {
      borderColor: theme.colors.ink,
      borderWidth: 2,
      backgroundColor: theme.colors.surfaceMuted,
    },
    choiceChipPressed: {
      opacity: 0.85,
    },
    choiceText: {
      color: theme.colors.ink,
      fontFamily: theme.font.bodyMedium,
    },
    choiceTextSelected: {
      fontFamily: theme.font.bodyBold,
    },
    ritualBar: {
      height: 3,
      width: 56,
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
      alignSelf: 'flex-start',
    },
    noteInput: {
      minHeight: 90,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: 12,
      textAlignVertical: 'top',
      backgroundColor: theme.colors.surfaceMuted,
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
  });

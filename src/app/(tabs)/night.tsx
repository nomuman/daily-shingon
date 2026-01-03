/**
 * Purpose: Night reflection screen (sange / hotsugan / ekou + note). / 目的: 夜のしめ画面（懺悔/発願/回向＋メモ）。
 * Responsibilities: load day card context, track steps, save/reset night log. / 役割: 当日カード文脈の読込、手順管理、夜ログ保存/リセット。
 * Inputs: optional date param, program day info, night log, translations. / 入力: 任意の日付パラメータ、プログラム日情報、夜ログ、翻訳文言。
 * Outputs: checklist + note UI and persistence actions. / 出力: チェックリスト/メモUIと保存アクション。
 * Dependencies: night log storage, curriculum content, Expo Router, i18n. / 依存: 夜ログストレージ、カリキュラム内容、Expo Router、i18n。
 * Side effects: reads/writes storage; navigation back to home. / 副作用: ストレージ読書き、ホームへの遷移。
 * Edge cases: missing date param, storage failures, missing card. / 例外: 日付未指定、ストレージ失敗、カード欠落。
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
import { useResponsiveLayout } from '../../ui/responsive';
import { useTheme, useThemedStyles, type Theme } from '../../ui/theme';

type CheckKey = 'sange' | 'hotsugan' | 'ekou';

type NightStyles = ReturnType<typeof createStyles>;

// Reusable checklist row with icon + description. / アイコン＋説明付きのチェック行。
const CheckItem = ({
  title,
  desc,
  checked,
  onPress,
  styles,
  iconCheckedColor,
  iconUncheckedColor,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onPress: () => void;
  styles: NightStyles;
  iconCheckedColor: string;
  iconUncheckedColor: string;
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
    <View style={styles.checkTitleRow}>
      <AppIcon
        name={checked ? 'check' : 'uncheck'}
        size={18}
        color={checked ? iconCheckedColor : iconUncheckedColor}
      />
      <Text style={[styles.checkTitle, checked && styles.checkTitleSelected]}>{title}</Text>
    </View>
    <Text style={styles.checkDesc}>{desc}</Text>
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

  // Resolve the target date (explicit param or today). / 対象日を解決（指定日または今日）。
  const dateParam = useMemo(() => (date ? parseISODateLocal(date) : null), [date]);
  const getTargetDate = useCallback(() => dateParam ?? new Date(), [dateParam]);

  const [loading, setLoading] = useState(true);

  const [dayTitle, setDayTitle] = useState<string>('');
  const [nightQuestion, setNightQuestion] = useState<string>('');

  const [sangeDone, setSangeDone] = useState(false);
  const [hotsuganDone, setHotsuganDone] = useState(false);
  const [ekouDone, setEkouDone] = useState(false);
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

  // Load program day context + saved night log. / 当日カード文脈と保存済み夜ログを読込。
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
        setSangeDone(saved.sangeDone);
        setHotsuganDone(saved.hotsuganDone);
        setEkouDone(saved.ekouDone);
        setNote(saved.note ?? '');
      }
    } catch (err) {
      console.error('Failed to load night log.', err);
      setError(t('errors.nightLoadFail'));
    } finally {
      setLoading(false);
    }
  }, [contentLang, getTargetDate, t]);

  // Initial load. / 初回ロード。
  useEffect(() => {
    void load();
  }, [load]);

  // Derived completion status for status row. / ステータス表示用の完了状態。
  const complete = useMemo(() => {
    return isNightComplete({
      dateISO: dateParam ? toISODateLocal(dateParam) : 'today',
      sangeDone,
      hotsuganDone,
      ekouDone,
      note,
      savedAtISO: '',
    });
  }, [dateParam, ekouDone, hotsuganDone, note, sangeDone]);

  // Toggle a single step. / 単一ステップのトグル。
  const toggle = (k: CheckKey) => {
    if (k === 'sange') setSangeDone((v) => !v);
    if (k === 'hotsugan') setHotsuganDone((v) => !v);
    if (k === 'ekou') setEkouDone((v) => !v);
  };

  // Loading/error gates before main UI. / ロード・エラー時の分岐。
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
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <View style={styles.ritualBar} />
          <Text style={styles.sectionTitle}>{t('night.stepsTitle')}</Text>

          <CheckItem
            title={t('night.steps.sange.title')}
            desc={t('night.steps.sange.desc')}
            checked={sangeDone}
            onPress={() => {
              triggerHaptic();
              toggle('sange');
            }}
            styles={styles}
            iconCheckedColor={theme.colors.accentDark}
            iconUncheckedColor={theme.colors.inkMuted}
          />
          <CheckItem
            title={t('night.steps.hotsugan.title')}
            desc={t('night.steps.hotsugan.desc')}
            checked={hotsuganDone}
            onPress={() => {
              triggerHaptic();
              toggle('hotsugan');
            }}
            styles={styles}
            iconCheckedColor={theme.colors.accentDark}
            iconUncheckedColor={theme.colors.inkMuted}
          />
          <CheckItem
            title={t('night.steps.ekou.title')}
            desc={t('night.steps.ekou.desc')}
            checked={ekouDone}
            onPress={() => {
              triggerHaptic();
              toggle('ekou');
            }}
            styles={styles}
            iconCheckedColor={theme.colors.accentDark}
            iconUncheckedColor={theme.colors.inkMuted}
          />
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
              // Persist night log and return to previous screen. / 夜ログを保存して前画面へ戻る。
              await setNightLog({ sangeDone, hotsuganDone, ekouDone, note, date: getTargetDate() });
              void saveEntry({
                date: entryDate,
                slot: 'night',
                bodyDone: sangeDone,
                speechDone: hotsuganDone,
                mindDone: ekouDone,
                noteCiphertext,
                noteVersion: noteCiphertext ? 0 : 1,
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
              // Clear saved log and reset local toggles. / 保存ログを削除し、ローカル状態をリセット。
              await clearNightLog(getTargetDate());
              setSangeDone(false);
              setHotsuganDone(false);
              setEkouDone(false);
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
    bodyText: {
      lineHeight: 22,
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    mutedText: {
      color: theme.colors.inkMuted,
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
    checkDesc: {
      marginTop: 6,
      color: theme.colors.inkMuted,
      lineHeight: 22,
      fontFamily: theme.font.body,
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

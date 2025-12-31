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
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { AppIcon } from '../../components/AppIcon';
import BackButton from '../../components/BackButton';
import { parseISODateLocal, toISODateLocal } from '../../lib/date';
import ErrorState from '../../components/ErrorState';
import {
  clearMorningLog,
  getMorningLog,
  isMorningComplete,
  setMorningLog,
} from '../../lib/morningLog';
import { useTheme, useThemedStyles, type CardShadow, type Theme } from '../../ui/theme';

type CheckKey = 'body' | 'speech' | 'mind';

export default function MorningScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { date } = useLocalSearchParams<{ date?: string }>();

  // Resolve the target date (explicit param or today). / 対象日を解決（指定日または今日）。
  const dateParam = useMemo(() => (date ? parseISODateLocal(date) : null), [date]);
  const getTargetDate = useCallback(() => dateParam ?? new Date(), [dateParam]);

  const [loading, setLoading] = useState(true);
  const [bodyDone, setBodyDone] = useState(false);
  const [speechDone, setSpeechDone] = useState(false);
  const [mindDone, setMindDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const saved = await getMorningLog(getTargetDate());
      if (saved) {
        setBodyDone(saved.bodyDone);
        setSpeechDone(saved.speechDone);
        setMindDone(saved.mindDone);
      }
    } catch (err) {
      console.error('Failed to load morning log.', err);
      setError(t('errors.morningLoadFail'));
    } finally {
      setLoading(false);
    }
  }, [getTargetDate, t]);

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
    title: string;
    desc: string;
    checked: boolean;
    onPress: () => void;
  }) => {
    return (
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
            color={checked ? theme.colors.accentDark : theme.colors.inkMuted}
          />
          <Text style={[styles.checkTitle, checked && styles.checkTitleSelected]}>{title}</Text>
        </View>
        <Text style={styles.checkDesc}>{desc}</Text>
      </Pressable>
    );
  };

  // Loading/error gates before main UI. / ローディング・エラー時の分岐。
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingWrap}>
          <BackButton style={styles.backButton} />
          <View style={styles.loading}>
            <ActivityIndicator color={theme.colors.accent} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} showBack />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <BackButton />
        <Text style={styles.title}>{t('morning.title')}</Text>

        <View style={styles.card}>
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
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('morning.checkTitle')}</Text>

          <Item
            title={t('morning.check.body.title')}
            desc={t('morning.check.body.desc')}
            checked={bodyDone}
            onPress={() => toggle('body')}
          />
          <Item
            title={t('morning.check.speech.title')}
            desc={t('morning.check.speech.desc')}
            checked={speechDone}
            onPress={() => toggle('speech')}
          />
          <Item
            title={t('morning.check.mind.title')}
            desc={t('morning.check.mind.desc')}
            checked={mindDone}
            onPress={() => toggle('mind')}
          />
        </View>

        <Pressable
          onPress={async () => {
            try {
              // Persist morning log and return to previous screen. / 朝ログを保存して前画面へ戻る。
              await setMorningLog({ bodyDone, speechDone, mindDone, date: getTargetDate() });
              goBackOrHome();
            } catch (err) {
              console.error('Failed to save morning log.', err);
              setError(t('errors.saveFail'));
            }
          }}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>{t('morning.saveButton')}</Text>
        </Pressable>

        <Pressable
          onPress={async () => {
            try {
              // Clear saved log and reset local toggles. / 保存ログを削除し、ローカル状態をリセット。
              await clearMorningLog(getTargetDate());
              setBodyDone(false);
              setSpeechDone(false);
              setMindDone(false);
            } catch (err) {
              console.error('Failed to reset morning log.', err);
              setError(t('errors.updateFail'));
            }
          }}
          style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
        >
          <Text style={styles.ghostButtonText}>{t('morning.resetButton')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme, cardShadow: CardShadow) =>
  StyleSheet.create({
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
    },
    card: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
      ...cardShadow,
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
    },
    checkTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    checkTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
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
  });

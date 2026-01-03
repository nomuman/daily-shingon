/**
 * Purpose: Home (Today) screen summarizing progress and next actions. / 目的: 進捗と次の行動をまとめるホーム画面。
 * Responsibilities: load daily status, show next action, allow resets, and link to history. / 役割: 日次状態の読込、次の行動表示、リセット、履歴導線。
 * Inputs: program day info, logs, today selection, translations, theme tokens. / 入力: プログラム日情報、ログ、今日の選択、翻訳文言、テーマトークン。
 * Outputs: status dashboard UI and navigation actions. / 出力: ダッシュボードUIと遷移アクション。
 * Dependencies: log loaders/resetters, content cards, engagement status, Expo Router, i18n. / 依存: ログ入出力、カード内容、エンゲージメント状態、Expo Router、i18n。
 * Side effects: data reads/writes (clears), navigation to other routes. / 副作用: 読込/削除、画面遷移。
 * Edge cases: missing card, storage errors, first-day defaults. / 例外: カード欠落、ストレージエラー、初日デフォルト。
 */
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import AppButton from '../../components/AppButton';
import { AppIcon } from '../../components/AppIcon';
import ErrorState from '../../components/ErrorState';
import Screen from '../../components/Screen';
import SurfaceCard from '../../components/SurfaceCard';
import { getDayCard } from '../../content/curriculum30';
import { useContentLang } from '../../content/useContentLang';
import { getReturnStatus } from '../../lib/engagement';
import { getLastNDaysStatus, type DailyStatus } from '../../lib/history';
import { getMorningLog, isMorningComplete } from '../../lib/morningLog';
import { getNightLog, isNightComplete } from '../../lib/nightLog';
import { getProgramDayInfo } from '../../lib/programDay';
import { getTodayActionSelection } from '../../lib/todayLog';
import { useResponsiveLayout } from '../../ui/responsive';
import { useTheme, useThemedStyles, type Theme } from '../../ui/theme';

type NextRoute = '/morning' | '/learn' | '/night';

// Shared entrance animation for screen sections. / 画面セクション共通の登場アニメ。
const entranceStyle = (anim: Animated.Value) => ({
  opacity: anim,
  transform: [
    {
      translateY: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
    },
  ],
});

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();
  const contentLang = useContentLang();

  const [dayNumber, setDayNumber] = useState<number>(1);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const [todayAction, setTodayAction] = useState<{ key: string; text: string } | null>(null);

  const [morningDone, setMorningDone] = useState<boolean>(false);
  const [nightDone, setNightDone] = useState<boolean>(false);
  const [statusState, setStatusState] = useState<'complete' | 'return' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<DailyStatus[]>([]);

  const heroAnim = useRef(new Animated.Value(0)).current;
  const actionsAnim = useRef(new Animated.Value(0)).current;
  const historyAnim = useRef(new Animated.Value(0)).current;

  // Aggregate all data needed by the home dashboard. / ホーム表示に必要なデータを集約。
  const refresh = useCallback(async () => {
    setError(null);
    try {
      const info = await getProgramDayInfo();
      setDayNumber(info.dayNumber);
      setIsComplete(info.isComplete);

      const card = getDayCard(contentLang, info.dayNumber);
      setTitle(card.title);

      const sel = await getTodayActionSelection();
      if (sel) {
        const matched = card.actionOptions.find((o) => o.key === sel.selectedKey);
        setTodayAction({
          key: sel.selectedKey,
          text: matched?.text ?? sel.selectedText,
        });
      } else {
        setTodayAction(null);
      }

      const m = await getMorningLog();
      setMorningDone(isMorningComplete(m));

      const n = await getNightLog();
      setNightDone(isNightComplete(n));

      const h = await getLastNDaysStatus(7);
      setHistory(h);

      const returnStatus = await getReturnStatus();
      if (info.isComplete) {
        setStatusState('complete');
      } else if (returnStatus.isReturn) {
        setStatusState('return');
      } else {
        setStatusState(null);
      }
    } catch (err) {
      console.error('Failed to refresh home screen data.', err);
      setError(t('errors.dataLoadFail'));
    }
  }, [contentLang, t]);

  // Refresh on focus to keep "today" data current. / フォーカス時に最新状態へ更新。
  useFocusEffect(
    useCallback(() => {
      refresh().catch((err) => {
        console.error('Failed to run focus refresh.', err);
      });
    }, [refresh]),
  );

  // Stagger in hero/actions/history cards. / ヒーロー/アクション/履歴カードを順次表示。
  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(heroAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(actionsAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(historyAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
    ]).start();
  }, [actionsAnim, heroAnim, historyAnim]);

  // Compute next action based on completion status. / 完了状況から次の行動を決定。
  const nextAction = useMemo<{ label: string; route: NextRoute | null }>(() => {
    if (!morningDone) return { label: t('home.nextAction.morning'), route: '/morning' };
    if (!todayAction) return { label: t('home.nextAction.learn'), route: '/learn' };
    if (!nightDone) return { label: t('home.nextAction.night'), route: '/night' };
    return { label: t('home.nextAction.done'), route: null };
  }, [morningDone, nightDone, t, todayAction]);

  // Return-state or completion-state banner. / 復帰・完走メッセージの表示判定。
  const statusMessage = useMemo(() => {
    if (statusState === 'complete') return t('home.statusComplete');
    if (statusState === 'return') return t('home.statusReturn');
    return null;
  }, [statusState, t]);

  const learnDone = !!todayAction;
  const primaryButtonLabel = nextAction.route ? nextAction.label : t('home.primaryDone');

  // Global error gate. / エラー時の共通ゲート。
  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <Screen edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
            accessibilityLabel={t('nav.settings')}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            <AppIcon name="settings" size={18} color={theme.colors.ink} />
          </Pressable>
        </View>
        <Animated.View style={entranceStyle(heroAnim)}>
          <SurfaceCard style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.kicker}>{t('home.kicker')}</Text>
                <Text style={styles.heroDay}>{t('home.dayLabel', { day: dayNumber })}</Text>
              </View>
              <View style={[styles.heroBadge, isComplete && styles.heroBadgeComplete]}>
                <Text style={[styles.heroBadgeText, isComplete && styles.heroBadgeTextComplete]}>
                  {isComplete ? t('home.badgeComplete') : t('home.badgeOngoing')}
                </Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>{title}</Text>

            {statusMessage && (
              <View style={styles.heroNotice}>
                <Text style={styles.heroNoticeText}>{statusMessage}</Text>
                {isComplete && (
                  <AppButton
                    label={t('home.resetFromSettings')}
                    variant="ghost"
                    size="sm"
                    style={styles.noticeButton}
                    onPress={() => router.push('/settings')}
                  />
                )}
              </View>
            )}

            <AppButton
              label={primaryButtonLabel}
              variant="primary"
              size="lg"
              disabled={!nextAction.route}
              rightIcon={
                nextAction.route ? (
                  <AppIcon name="arrow-forward" size={20} color={theme.colors.surface} />
                ) : null
              }
              onPress={() => {
                if (nextAction.route) router.push(nextAction.route);
              }}
            />
          </SurfaceCard>
        </Animated.View>

        <Animated.View style={[styles.sectionStack, entranceStyle(actionsAnim)]}>
          <Text style={styles.sectionTitle}>{t('home.flowTitle')}</Text>

          <SurfaceCard style={styles.actionCard} padding="md" elevated variant="outlined">
            <View style={[styles.ritualBar, styles.ritualBarMorning]} />
            <View style={styles.actionHeader}>
              <View style={[styles.iconBadge, styles.iconBadgeMorning]}>
                <AppIcon name="morning" size={20} color={theme.colors.accentDark} />
              </View>
              <View style={styles.actionHeaderText}>
                <Text style={styles.actionTitle}>{t('home.flowMorningTitle')}</Text>
                <Text style={styles.actionStatus}>
                  {morningDone ? t('common.done') : t('common.incomplete')}
                </Text>
              </View>
            </View>
            <Text style={styles.actionDescription}>{t('home.flowMorningBody')}</Text>
            <AppButton
              label={morningDone ? t('common.review') : t('common.do')}
              variant="primary"
              size="sm"
              onPress={() => router.push('/morning')}
            />
          </SurfaceCard>

          <SurfaceCard style={styles.actionCard} padding="md" elevated variant="outlined">
            <View style={[styles.ritualBar, styles.ritualBarLearn]} />
            <View style={styles.actionHeader}>
              <View style={[styles.iconBadge, styles.iconBadgeLearn]}>
                <AppIcon name="learn" size={20} color={theme.colors.accentDark} />
              </View>
              <View style={styles.actionHeaderText}>
                <Text style={styles.actionTitle}>{t('home.flowLearnTitle')}</Text>
                <Text style={styles.actionStatus}>
                  {learnDone ? t('home.selectionDone') : t('home.selectionNone')}
                </Text>
              </View>
            </View>
            <Text style={styles.actionDescription}>
              {todayAction
                ? t('home.selectionDetail', {
                    key: todayAction.key,
                    text: todayAction.text,
                  })
                : t('home.selectionEmpty')}
            </Text>
            <AppButton
              label={t('home.learnCta')}
              variant="primary"
              size="sm"
              onPress={() => router.push('/learn')}
            />
          </SurfaceCard>

          <SurfaceCard style={styles.actionCard} padding="md" elevated variant="outlined">
            <View style={[styles.ritualBar, styles.ritualBarNight]} />
            <View style={styles.actionHeader}>
              <View style={[styles.iconBadge, styles.iconBadgeNight]}>
                <AppIcon name="night" size={20} color={theme.colors.accentDark} />
              </View>
              <View style={styles.actionHeaderText}>
                <Text style={styles.actionTitle}>{t('home.flowNightTitle')}</Text>
                <Text style={styles.actionStatus}>
                  {nightDone ? t('common.done') : t('common.incomplete')}
                </Text>
              </View>
            </View>
            <Text style={styles.actionDescription}>{t('home.flowNightBody')}</Text>
            <AppButton
              label={nightDone ? t('common.review') : t('common.do')}
              variant="primary"
              size="sm"
              onPress={() => router.push('/night')}
            />
          </SurfaceCard>
        </Animated.View>

        <Animated.View style={entranceStyle(historyAnim)}>
          <SurfaceCard style={styles.card} elevated={false} variant="muted">
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>{t('home.recentTitle')}</Text>
              <AppButton
                label={t('home.recentCta')}
                variant="ghost"
                size="sm"
                style={styles.ghostButtonSmall}
                onPress={() => router.push('/history')}
              />
            </View>

            <View style={styles.historyHeader}>
              <Text style={[styles.historyLabel, styles.historyDate]}>{t('home.historyDate')}</Text>
              <Text style={styles.historyLabel}>{t('nav.morning')}</Text>
              <Text style={styles.historyLabel}>{t('nav.night')}</Text>
              <Text style={styles.historyLabel}>{t('home.historyMemo')}</Text>
            </View>

            {history.map((h) => (
              <View key={h.dateISO} style={styles.historyRow}>
                <Text style={[styles.historyValue, styles.historyDate]}>{h.dateISO}</Text>
                <View style={styles.historyCell}>
                  <View style={[styles.progressDot, h.morningDone && styles.progressDotActive]} />
                </View>
                <View style={styles.historyCell}>
                  <View style={[styles.progressDot, h.nightDone && styles.progressDotActive]} />
                </View>
                <View style={styles.historyCell}>
                  {h.nightHasNote ? (
                    <AppIcon name="memo" size={16} color={theme.colors.ink} />
                  ) : (
                    <Text style={styles.historyValue}>{t('common.dash')}</Text>
                  )}
                </View>
              </View>
            ))}

            <Text style={styles.historyFootnote}>{t('home.historyFootnote')}</Text>
          </SurfaceCard>
        </Animated.View>
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
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconButtonPressed: {
      opacity: 0.85,
    },
    heroCard: {
      borderRadius: theme.radius.xl,
      gap: theme.spacing.md,
    },
    heroTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    kicker: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    heroDay: {
      fontSize: 28,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
      letterSpacing: 0.6,
      lineHeight: 34,
    },
    heroBadge: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
    },
    heroBadgeComplete: {
      backgroundColor: theme.colors.successSoft,
    },
    heroBadgeText: {
      fontWeight: '700',
      color: theme.colors.accentDark,
      fontFamily: theme.font.body,
    },
    heroBadgeTextComplete: {
      color: theme.colors.success,
    },
    heroTitle: {
      fontSize: 18,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
      lineHeight: 26,
      letterSpacing: 0.3,
    },
    heroNotice: {
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surfaceMuted,
      gap: theme.spacing.xs,
    },
    heroNoticeText: {
      color: theme.colors.ink,
      lineHeight: 22,
      fontFamily: theme.font.body,
    },
    noticeButton: {
      alignSelf: 'flex-start',
    },
    progressDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.border,
    },
    progressDotActive: {
      backgroundColor: theme.colors.success,
    },
    ghostButtonSmall: {
      backgroundColor: theme.colors.surfaceMuted,
      borderColor: theme.colors.surfaceMuted,
    },
    card: {
      borderRadius: theme.radius.lg,
      gap: theme.spacing.sm,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.ink,
      fontFamily: theme.font.display,
      letterSpacing: 0.4,
    },
    sectionStack: {
      gap: theme.spacing.md,
    },
    actionCard: {
      borderRadius: theme.radius.lg,
      gap: theme.spacing.sm,
    },
    ritualBar: {
      height: 3,
      width: 56,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    ritualBarMorning: {
      backgroundColor: theme.colors.accentSoft,
    },
    ritualBarLearn: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    ritualBarNight: {
      backgroundColor: theme.colors.successSoft,
    },
    actionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    actionHeaderText: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    actionStatus: {
      fontSize: 12,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    actionDescription: {
      color: theme.colors.ink,
      lineHeight: 22,
      fontFamily: theme.font.body,
    },
    iconBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceMuted,
    },
    iconBadgeMorning: {
      backgroundColor: theme.colors.accentSoft,
    },
    iconBadgeLearn: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    iconBadgeNight: {
      backgroundColor: theme.colors.successSoft,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    historyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceMuted,
    },
    historyLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    historyValue: {
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    historyDate: {
      width: 110,
      fontVariant: ['tabular-nums'],
    },
    historyCell: {
      width: 30,
      alignItems: 'center',
    },
    historyFootnote: {
      fontSize: 12,
      color: theme.colors.inkMuted,
      lineHeight: 20,
      fontFamily: theme.font.body,
    },
  });

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorState from '../../components/ErrorState';
import { getDayCard } from '../../content/curriculum30.ja';
import { getReturnStatus } from '../../lib/engagement';
import { getProgramDayInfo } from '../../lib/programDay';
import { getLastNDaysStatus, type DailyStatus } from '../../lib/history';
import { clearMorningLog, getMorningLog, isMorningComplete } from '../../lib/morningLog';
import { clearNightLog, getNightLog, isNightComplete } from '../../lib/nightLog';
import { clearTodayActionSelection, getTodayActionSelection } from '../../lib/todayLog';
import { cardShadow, theme } from '../../ui/theme';

type NextRoute = '/morning' | '/learn' | '/night';

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

const ProgressChip = ({ label, done }: { label: string; done: boolean }) => (
  <View style={[styles.progressChip, done && styles.progressChipActive]}>
    <View style={[styles.progressDot, done && styles.progressDotActive]} />
    <Text style={[styles.progressText, done && styles.progressTextActive]}>{label}</Text>
  </View>
);

export default function HomeScreen() {
  const router = useRouter();

  const [dayNumber, setDayNumber] = useState<number>(1);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const [todayAction, setTodayAction] = useState<{ key: string; text: string } | null>(null);

  const [morningDone, setMorningDone] = useState<boolean>(false);
  const [nightDone, setNightDone] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<DailyStatus[]>([]);

  const heroAnim = useRef(new Animated.Value(0)).current;
  const actionsAnim = useRef(new Animated.Value(0)).current;
  const historyAnim = useRef(new Animated.Value(0)).current;

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const info = await getProgramDayInfo();
      setDayNumber(info.dayNumber);
      setIsComplete(info.isComplete);

      const card = getDayCard(info.dayNumber);
      setTitle(card.title);

      const sel = await getTodayActionSelection();
      setTodayAction(sel ? { key: sel.selectedKey, text: sel.selectedText } : null);

      const m = await getMorningLog();
      setMorningDone(isMorningComplete(m));

      const n = await getNightLog();
      setNightDone(isNightComplete(n));

      const h = await getLastNDaysStatus(7);
      setHistory(h);

      const returnStatus = await getReturnStatus();
      if (info.isComplete) {
        setStatusMessage('完走後モードです。必要なら設定からリセットできます。');
      } else if (returnStatus.isReturn) {
        setStatusMessage('おかえり。戻れたら十分。今日は短くでもOK。');
      } else {
        setStatusMessage(null);
      }
    } catch {
      setError(
        '保存データの読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(heroAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(actionsAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(historyAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
    ]).start();
  }, [actionsAnim, heroAnim, historyAnim]);

  const nextAction = useMemo<{ label: string; route: NextRoute | null }>(() => {
    if (!morningDone) return { label: '朝を整える', route: '/morning' };
    if (!todayAction) return { label: '学びを見る', route: '/learn' };
    if (!nightDone) return { label: '夜を閉じる', route: '/night' };
    return { label: '今日はここまで', route: null };
  }, [morningDone, nightDone, todayAction]);

  const learnDone = !!todayAction;
  const primaryButtonLabel = nextAction.route ? nextAction.label : '今日は十分できています';

  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Animated.View style={[styles.heroCard, entranceStyle(heroAnim)]}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.kicker}>今日</Text>
            <Text style={styles.heroDay}>Day {dayNumber}</Text>
          </View>
          <View style={[styles.heroBadge, isComplete && styles.heroBadgeComplete]}>
            <Text style={[styles.heroBadgeText, isComplete && styles.heroBadgeTextComplete]}>
              {isComplete ? '完走' : '継続中'}
            </Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{title}</Text>

        {statusMessage && (
          <View style={styles.heroNotice}>
            <Text style={styles.heroNoticeText}>{statusMessage}</Text>
            {isComplete && (
              <Pressable
                onPress={() => router.push('/settings')}
                style={({ pressed }) => [
                  styles.noticeButton,
                  pressed && styles.noticeButtonPressed,
                ]}
              >
                <Text style={styles.noticeButtonText}>設定でリセット</Text>
              </Pressable>
            )}
          </View>
        )}

        <View style={styles.progressRow}>
          <ProgressChip label="朝" done={morningDone} />
          <ProgressChip label="学び" done={learnDone} />
          <ProgressChip label="夜" done={nightDone} />
        </View>

        <Pressable
          disabled={!nextAction.route}
          onPress={() => {
            if (nextAction.route) router.push(nextAction.route);
          }}
          style={({ pressed }) => [
            styles.primaryButton,
            !nextAction.route && styles.primaryButtonDisabled,
            pressed && nextAction.route && styles.primaryButtonPressed,
          ]}
        >
          <View style={styles.primaryButtonContent}>
            <Text
              style={[
                styles.primaryButtonText,
                !nextAction.route && styles.primaryButtonTextDisabled,
              ]}
            >
              {primaryButtonLabel}
            </Text>
            {nextAction.route && (
              <MaterialIcons name="arrow-forward" size={20} color={theme.colors.surface} />
            )}
          </View>
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.card, styles.cardAccent, entranceStyle(actionsAnim)]}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>365日（積み上げ）</Text>
            <Text style={styles.sectionSubtitle}>勤行が終わった日は、静かに色が増えていく。</Text>
          </View>
          <View style={styles.badgeSoft}>
            <Text style={styles.badgeSoftText}>進捗</Text>
          </View>
        </View>

        <Text style={styles.sectionBody}>
          空白があっても、戻れば続きになる。今日の一歩を静かに足す。
        </Text>

        <View style={styles.rowButtons}>
          <Pressable
            onPress={() => router.push('/history')}
            style={({ pressed }) => [
              styles.primaryButton,
              styles.primaryButtonCompact,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <View style={styles.primaryButtonContent}>
              <Text style={styles.primaryButtonText}>365日を見る</Text>
              <MaterialIcons name="north-east" size={18} color={theme.colors.surface} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push('/history')}
            style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
          >
            <Text style={styles.ghostButtonText}>詳細</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View style={[styles.sectionStack, entranceStyle(actionsAnim)]}>
        <Text style={styles.sectionTitle}>今日の流れ</Text>

        <View style={styles.actionCard}>
          <View style={styles.actionHeader}>
            <View style={[styles.iconBadge, styles.iconBadgeMorning]}>
              <MaterialIcons name="wb-sunny" size={20} color={theme.colors.accentDark} />
            </View>
            <View style={styles.actionHeaderText}>
              <Text style={styles.actionTitle}>朝の整え（身・口・意）</Text>
              <Text style={styles.actionStatus}>{morningDone ? '完了' : '未完了'}</Text>
            </View>
          </View>
          <Text style={styles.actionDescription}>3分で姿勢と呼吸を揃える。</Text>
          <View style={styles.rowButtons}>
            <Pressable
              onPress={() => router.push('/morning')}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.primaryButtonCompact,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>{morningDone ? '見直す' : 'やる'}</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                try {
                  await clearMorningLog();
                  await refresh();
                } catch {
                  setError(
                    '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
                  );
                }
              }}
              style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
            >
              <Text style={styles.ghostButtonText}>リセット</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionHeader}>
            <View style={[styles.iconBadge, styles.iconBadgeLearn]}>
              <MaterialIcons name="menu-book" size={20} color={theme.colors.accentDark} />
            </View>
            <View style={styles.actionHeaderText}>
              <Text style={styles.actionTitle}>今日の行い</Text>
              <Text style={styles.actionStatus}>{learnDone ? '選択済み' : '未選択'}</Text>
            </View>
          </View>
          <Text style={styles.actionDescription}>
            {todayAction
              ? `・[${todayAction.key}] ${todayAction.text}`
              : 'まだ選んでない。Learnで「今日はこれでいく」を押してね。'}
          </Text>
          <View style={styles.rowButtons}>
            <Pressable
              onPress={() => router.push('/learn')}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.primaryButtonCompact,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Learnへ</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                try {
                  await clearTodayActionSelection();
                  await refresh();
                } catch {
                  setError(
                    '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
                  );
                }
              }}
              style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
            >
              <Text style={styles.ghostButtonText}>選択を解除</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionHeader}>
            <View style={[styles.iconBadge, styles.iconBadgeNight]}>
              <MaterialIcons name="nights-stay" size={20} color={theme.colors.accentDark} />
            </View>
            <View style={styles.actionHeaderText}>
              <Text style={styles.actionTitle}>夜のしめ（懺悔→発願→回向）</Text>
              <Text style={styles.actionStatus}>{nightDone ? '完了' : '未完了'}</Text>
            </View>
          </View>
          <Text style={styles.actionDescription}>45秒で振り返りを閉じる。</Text>
          <View style={styles.rowButtons}>
            <Pressable
              onPress={() => router.push('/night')}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.primaryButtonCompact,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>{nightDone ? '見直す' : 'やる'}</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                try {
                  await clearNightLog();
                  await refresh();
                } catch {
                  setError(
                    '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
                  );
                }
              }}
              style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
            >
              <Text style={styles.ghostButtonText}>リセット</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.card, entranceStyle(historyAnim)]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.sectionTitle}>直近7日（朝 / 夜）</Text>
          <Pressable
            onPress={() => router.push('/history')}
            style={({ pressed }) => [styles.ghostButtonSmall, pressed && styles.ghostButtonPressed]}
          >
            <Text style={styles.ghostButtonText}>365日へ</Text>
          </Pressable>
        </View>

        <View style={styles.historyHeader}>
          <Text style={[styles.historyLabel, styles.historyDate]}>日付</Text>
          <Text style={styles.historyLabel}>朝</Text>
          <Text style={styles.historyLabel}>夜</Text>
          <Text style={styles.historyLabel}>メモ</Text>
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
              <Text style={styles.historyValue}>{h.nightHasNote ? '📝' : '—'}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.historyFootnote}>
          ※これはスコアではなく「ふり返りの足場」。抜けても責めない。
        </Text>
      </Animated.View>

      <Text style={styles.footerNote}>
        ※ タブ移動・戻る操作で最新を反映するため、フォーカス時に再読み込みしています。
      </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
    gap: theme.spacing.md,
  },
  heroCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.md,
    ...cardShadow,
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
    lineHeight: 24,
  },
  heroNotice: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
    gap: theme.spacing.xs,
  },
  heroNoticeText: {
    color: theme.colors.ink,
    lineHeight: 20,
    fontFamily: theme.font.body,
  },
  noticeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  noticeButtonPressed: {
    opacity: 0.85,
  },
  noticeButtonText: {
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  progressRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  progressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceMuted,
    gap: 6,
  },
  progressChipActive: {
    backgroundColor: theme.colors.successSoft,
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
  progressText: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  progressTextActive: {
    color: theme.colors.success,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ink,
  },
  primaryButtonCompact: {
    minHeight: 42,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontWeight: '700',
    fontFamily: theme.font.body,
  },
  primaryButtonTextDisabled: {
    color: theme.colors.inkMuted,
  },
  ghostButton: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghostButtonSmall: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.surfaceMuted,
  },
  ghostButtonPressed: {
    opacity: 0.85,
  },
  ghostButtonText: {
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
    ...cardShadow,
  },
  cardAccent: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.accentSoft,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  badgeSoft: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.accentSoft,
  },
  badgeSoftText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.accentDark,
    fontFamily: theme.font.body,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.display,
  },
  sectionSubtitle: {
    color: theme.colors.inkMuted,
    fontSize: 12,
    fontFamily: theme.font.body,
  },
  sectionBody: {
    color: theme.colors.ink,
    lineHeight: 20,
    fontFamily: theme.font.body,
  },
  sectionStack: {
    gap: theme.spacing.md,
  },
  actionCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
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
    lineHeight: 20,
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
  rowButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
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
    lineHeight: 18,
    fontFamily: theme.font.body,
  },
  footerNote: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    lineHeight: 18,
    fontFamily: theme.font.body,
  },
});

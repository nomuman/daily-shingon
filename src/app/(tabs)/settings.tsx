import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ErrorState from '../../components/ErrorState';
import {
  cancelDailyReminders,
  ensureNotificationPermission,
  scheduleDailyReminders,
} from '../../lib/notifications';
import { resetAllProgress } from '../../lib/reset';
import { DEFAULT_SETTINGS, getSettings, setSettings } from '../../lib/settings';
import { cardShadow, theme } from '../../ui/theme';

type TimeField = 'morning' | 'night';

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

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [settings, setLocalSettings] = useState(DEFAULT_SETTINGS);
  const [morningInput, setMorningInput] = useState(DEFAULT_SETTINGS.notifications.morningTime);
  const [nightInput, setNightInput] = useState(DEFAULT_SETTINGS.notifications.nightTime);
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showNightPicker, setShowNightPicker] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const notifyAnim = useRef(new Animated.Value(0)).current;
  const timeAnim = useRef(new Animated.Value(0)).current;
  const resetAnim = useRef(new Animated.Value(0)).current;

  const load = useCallback(async () => {
    setLoading(true);
    setFatalError(null);
    setNotice(null);
    try {
      const saved = await getSettings();
      setLocalSettings(saved);
      setMorningInput(saved.notifications.morningTime);
      setNightInput(saved.notifications.nightTime);
    } catch {
      setFatalError(
        '設定の読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    Animated.stagger(140, [
      Animated.timing(headerAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(notifyAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(timeAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(resetAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
    ]).start();
  }, [headerAnim, notifyAnim, resetAnim, timeAnim]);

  const reminderEnabled = settings.notifications.enabled;
  const permissionStatus = settings.notifications.permissionStatus;

  const validateTime = (value: string) => {
    return /^([01]\\d|2[0-3]):([0-5]\\d)$/.test(value);
  };

  const toTimeString = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const timeToDate = (time: string) => {
    if (!validateTime(time)) return new Date();
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
  };

  const persistSettings = async (next: typeof settings) => {
    setLocalSettings(next);
    await setSettings(next);
  };

  const applyTime = async (field: TimeField, value: string) => {
    if (!validateTime(value)) {
      setNotice('時刻は24時間表記の HH:mm で入力してください。');
      return;
    }

    const prevIds = {
      morningId: settings.notifications.morningId,
      nightId: settings.notifications.nightId,
    };

    const next = {
      ...settings,
      notifications: {
        ...settings.notifications,
        morningTime: field === 'morning' ? value : settings.notifications.morningTime,
        nightTime: field === 'night' ? value : settings.notifications.nightTime,
      },
    };

    setNotice(null);
    if (next.notifications.enabled) {
      try {
        await cancelDailyReminders(prevIds);
        const ids = await scheduleDailyReminders(
          next.notifications.morningTime,
          next.notifications.nightTime,
        );
        await persistSettings({
          ...next,
          notifications: { ...next.notifications, ...ids },
        });
      } catch {
        setNotice('通知の再設定に失敗しました。再試行してください。');
      }
    } else {
      await persistSettings(next);
    }
  };

  const handleTimeChange = (field: TimeField) => (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowMorningPicker(false);
      setShowNightPicker(false);
    }

    if (event.type === 'dismissed' || !date) return;

    const value = toTimeString(date);
    if (field === 'morning') setMorningInput(value);
    if (field === 'night') setNightInput(value);
    void applyTime(field, value);
  };

  const toggleReminders = async (nextEnabled: boolean) => {
    setNotice(null);
    if (!nextEnabled) {
      try {
        await cancelDailyReminders(settings.notifications);
        await persistSettings({
          ...settings,
          notifications: {
            ...settings.notifications,
            enabled: false,
            morningId: undefined,
            nightId: undefined,
          },
        });
      } catch {
        setNotice('通知の停止に失敗しました。');
      }
      return;
    }

    const status = await ensureNotificationPermission();
    if (status !== 'granted') {
      await persistSettings({
        ...settings,
        notifications: {
          ...settings.notifications,
          enabled: false,
          permissionStatus: status,
        },
      });
      setNotice('通知の許可が必要です。設定アプリから許可してください。');
      return;
    }

    try {
      const ids = await scheduleDailyReminders(
        settings.notifications.morningTime,
        settings.notifications.nightTime,
      );
      await persistSettings({
        ...settings,
        notifications: {
          ...settings.notifications,
          enabled: true,
          permissionStatus: status,
          ...ids,
        },
      });
    } catch {
      setNotice('通知の設定に失敗しました。');
    }
  };

  const openSystemSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      setNotice('設定アプリを開けませんでした。');
    }
  };

  const handleReset = () => {
    Alert.alert(
      '開始日をリセット',
      '開始日・今日の行い・朝/夜ログ・復帰判定を削除します。よろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセットする',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetAllProgress();
            } catch {
              setNotice('リセットに失敗しました。');
            }
          },
        },
      ],
    );
  };

  const settingsSummary = useMemo(() => {
    return reminderEnabled ? '通知ON' : '通知OFF';
  }, [reminderEnabled]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (fatalError) {
    return <ErrorState message={fatalError} onRetry={load} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Animated.View style={[styles.headerCard, entranceStyle(headerAnim)]}>
        <Text style={styles.kicker}>設定</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>日々の整えを静かに支える</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{settingsSummary}</Text>
          </View>
        </View>
        <Text style={styles.headerBody}>
          通知や開始日の調整はここから。必要なときだけ、シンプルに。
        </Text>
      </Animated.View>

      {!!notice && (
        <Animated.View style={[styles.noticeCard, entranceStyle(notifyAnim)]}>
          <Text style={styles.noticeText}>{notice}</Text>
        </Animated.View>
      )}

      <Animated.View style={[styles.card, entranceStyle(notifyAnim)]}>
        <Text style={styles.sectionTitle}>通知</Text>
        <Text style={styles.sectionSubtitle}>状態：{settingsSummary}</Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>朝/夜リマインダー</Text>
          <Switch
            value={reminderEnabled}
            onValueChange={toggleReminders}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.accentSoft,
            }}
            thumbColor={reminderEnabled ? theme.colors.accent : theme.colors.surface}
          />
        </View>

        {permissionStatus === 'denied' && (
          <View style={styles.inlineNotice}>
            <Text style={styles.inlineNoticeText}>
              通知が拒否されています。設定アプリで許可してください。
            </Text>
            <Pressable
              onPress={openSystemSettings}
              style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
            >
              <Text style={styles.ghostButtonText}>設定アプリを開く</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>

      <Animated.View style={[styles.card, entranceStyle(timeAnim)]}>
        <Text style={styles.sectionTitle}>通知時刻</Text>

        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>朝（HH:mm）</Text>
          <Pressable
            onPress={() => setShowMorningPicker(true)}
            style={({ pressed }) => [styles.timeInput, pressed && styles.timeInputPressed]}
          >
            <Text style={styles.timeValue}>{morningInput}</Text>
          </Pressable>
          {showMorningPicker && (
            <DateTimePicker
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={timeToDate(morningInput)}
              onChange={handleTimeChange('morning')}
            />
          )}
          {showMorningPicker && Platform.OS === 'ios' && (
            <Pressable
              onPress={() => setShowMorningPicker(false)}
              style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
            >
              <Text style={styles.ghostButtonText}>完了</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>夜（HH:mm）</Text>
          <Pressable
            onPress={() => setShowNightPicker(true)}
            style={({ pressed }) => [styles.timeInput, pressed && styles.timeInputPressed]}
          >
            <Text style={styles.timeValue}>{nightInput}</Text>
          </Pressable>
          {showNightPicker && (
            <DateTimePicker
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={timeToDate(nightInput)}
              onChange={handleTimeChange('night')}
            />
          )}
          {showNightPicker && Platform.OS === 'ios' && (
            <Pressable
              onPress={() => setShowNightPicker(false)}
              style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
            >
              <Text style={styles.ghostButtonText}>完了</Text>
            </Pressable>
          )}
        </View>
      </Animated.View>

      <Animated.View style={[styles.card, entranceStyle(resetAnim)]}>
        <Text style={styles.sectionTitle}>リセット</Text>
        <Text style={styles.sectionSubtitle}>開始日と当日の記録を削除します。戻せません。</Text>
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [styles.dangerButton, pressed && styles.dangerButtonPressed]}
        >
          <Text style={styles.dangerButtonText}>開始日をリセット</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.card, entranceStyle(resetAnim)]}>
        <Text style={styles.sectionTitle}>お問い合わせ</Text>
        <Text style={styles.sectionSubtitle}>お問い合わせ先は後で設定します。</Text>
        {/* TODO: 問い合わせ先（メール or フォームURL）を設定する */}
      </Animated.View>
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  headerCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
    ...cardShadow,
  },
  kicker: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: theme.font.display,
    color: theme.colors.ink,
    lineHeight: 24,
  },
  headerBody: {
    color: theme.colors.inkMuted,
    lineHeight: 20,
    fontFamily: theme.font.body,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.accentSoft,
  },
  badgeText: {
    fontWeight: '700',
    color: theme.colors.accentDark,
    fontFamily: theme.font.body,
  },
  noticeCard: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.dangerSoft,
  },
  noticeText: {
    color: theme.colors.danger,
    fontFamily: theme.font.body,
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
    fontFamily: theme.font.display,
  },
  sectionSubtitle: {
    color: theme.colors.inkMuted,
    lineHeight: 20,
    fontFamily: theme.font.body,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontWeight: '600',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  inlineNotice: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  inlineNoticeText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  ghostButton: {
    alignSelf: 'flex-start',
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceMuted,
  },
  ghostButtonPressed: {
    opacity: 0.85,
  },
  ghostButtonText: {
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  timeBlock: {
    gap: theme.spacing.xs,
  },
  timeLabel: {
    fontWeight: '600',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  timeInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  timeInputPressed: {
    opacity: 0.85,
  },
  timeValue: {
    fontSize: 16,
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  dangerButton: {
    minHeight: 46,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.surface,
  },
  dangerButtonPressed: {
    opacity: 0.85,
  },
  dangerButtonText: {
    fontWeight: '700',
    color: theme.colors.danger,
    fontFamily: theme.font.body,
  },
});

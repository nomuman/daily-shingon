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

import { useTranslation } from 'react-i18next';
import ErrorState from '../../components/ErrorState';
import { getLanguagePreference, setLanguagePreference } from '../../lib/i18n';
import type { LanguagePreference } from '../../lib/i18n/storage';
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
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [settings, setLocalSettings] = useState(DEFAULT_SETTINGS);
  const [morningInput, setMorningInput] = useState(DEFAULT_SETTINGS.notifications.morningTime);
  const [nightInput, setNightInput] = useState(DEFAULT_SETTINGS.notifications.nightTime);
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showNightPicker, setShowNightPicker] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [languagePref, setLanguagePref] = useState<LanguagePreference>('system');

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
      setFatalError(t('errors.settingsLoadFail'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    getLanguagePreference().then(setLanguagePref);
  }, []);

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
      setNotice(t('settings.time.invalid'));
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
        setNotice(t('settings.notifications.rescheduleFail'));
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
        setNotice(t('settings.notifications.stopFail'));
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
      setNotice(t('settings.notifications.permissionRequired'));
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
      setNotice(t('settings.notifications.scheduleFail'));
    }
  };

  const openSystemSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      setNotice(t('settings.systemSettingsFail'));
    }
  };

  const handleReset = () => {
    Alert.alert(t('settings.reset.title'), t('settings.reset.body'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.reset.confirm'),
        style: 'destructive',
        onPress: async () => {
          try {
            await resetAllProgress();
          } catch {
            setNotice(t('settings.reset.fail'));
          }
        },
      },
    ]);
  };

  const settingsSummary = useMemo(() => {
    return reminderEnabled ? t('settings.notifications.on') : t('settings.notifications.off');
  }, [reminderEnabled, t]);

  const languageOptions = useMemo(
    () => [
      { value: 'system' as const, label: t('settings.language.system') },
      { value: 'ja' as const, label: t('settings.language.japanese') },
      { value: 'en' as const, label: t('settings.language.english') },
    ],
    [t],
  );

  const handleLanguageSelect = async (value: LanguagePreference) => {
    setLanguagePref(value);
    await setLanguagePreference(value);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>{t('common.loadingSimple')}</Text>
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
          <Text style={styles.kicker}>{t('settings.kicker')}</Text>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{t('settings.headerTitle')}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{settingsSummary}</Text>
            </View>
          </View>
          <Text style={styles.headerBody}>{t('settings.headerBody')}</Text>
        </Animated.View>

        {!!notice && (
          <Animated.View style={[styles.noticeCard, entranceStyle(notifyAnim)]}>
            <Text style={styles.noticeText}>{notice}</Text>
          </Animated.View>
        )}

        <Animated.View style={[styles.card, entranceStyle(notifyAnim)]}>
          <Text style={styles.sectionTitle}>{t('settings.language.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.language.description')}</Text>

          <View style={styles.optionList}>
            {languageOptions.map((option, index) => (
              <Pressable
                key={option.value}
                onPress={() => handleLanguageSelect(option.value)}
                style={({ pressed }) => [
                  styles.optionRow,
                  index > 0 && styles.optionRowDivider,
                  pressed && styles.optionRowPressed,
                ]}
              >
                <View style={styles.radioOuter}>
                  {languagePref === option.value && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionHint}>{t('settings.language.note')}</Text>
        </Animated.View>

        <Animated.View style={[styles.card, entranceStyle(notifyAnim)]}>
          <Text style={styles.sectionTitle}>{t('settings.notifications.title')}</Text>
          <Text style={styles.sectionSubtitle}>
            {t('common.statusWithValue', { value: settingsSummary })}
          </Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('settings.notifications.toggle')}</Text>
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
                {t('settings.notifications.permissionDenied')}
              </Text>
              <Pressable
                onPress={openSystemSettings}
                style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
              >
                <Text style={styles.ghostButtonText}>
                  {t('settings.notifications.openSettings')}
                </Text>
              </Pressable>
            </View>
          )}
        </Animated.View>

        <Animated.View style={[styles.card, entranceStyle(timeAnim)]}>
          <Text style={styles.sectionTitle}>{t('settings.time.title')}</Text>

          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>{t('settings.time.morning')}</Text>
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
                <Text style={styles.ghostButtonText}>{t('common.done')}</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>{t('settings.time.night')}</Text>
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
                <Text style={styles.ghostButtonText}>{t('common.done')}</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, entranceStyle(resetAnim)]}>
          <Text style={styles.sectionTitle}>{t('settings.reset.sectionTitle')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.reset.sectionBody')}</Text>
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [styles.dangerButton, pressed && styles.dangerButtonPressed]}
          >
            <Text style={styles.dangerButtonText}>{t('settings.reset.button')}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.card, entranceStyle(resetAnim)]}>
          <Text style={styles.sectionTitle}>{t('settings.contact.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.contact.body')}</Text>
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
  sectionHint: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
    marginTop: theme.spacing.sm,
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
  optionList: {
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  optionRowDivider: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  optionRowPressed: {
    opacity: 0.85,
  },
  optionText: {
    fontSize: 15,
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: theme.colors.inkMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.ink,
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

/**
 * Purpose: Settings screen for preferences, notifications, language, theme, legal links, and reset. / 目的: 設定（通知/言語/テーマ/法務/リセット）画面。
 * Responsibilities: load/persist settings, schedule/cancel reminders, and expose system/legal actions. / 役割: 設定読込/保存、通知スケジュール、システム/法務アクションの提供。
 * Inputs: stored settings + language preference, app config URLs, and translated copy. / 入力: 保存済み設定/言語設定、アプリ設定URL、翻訳文言。
 * Outputs: settings UI sections and user-triggered actions (navigation, scheduling, reset). / 出力: 設定UIとユーザー操作（遷移/通知/リセット）。
 * Dependencies: i18n, AsyncStorage-backed settings, expo-notifications, expo-web-browser, router. / 依存: i18n、AsyncStorage設定、expo-notifications、expo-web-browser、router。
 * Side effects: storage writes, notification scheduling, opening system settings/browser, reset progress. / 副作用: ストレージ書込、通知予約、設定/ブラウザ起動、進捗リセット。
 * Edge cases: permission denied, invalid time input, missing URLs, load/save failures. / 例外: 権限拒否、時間入力不正、URL欠落、読込/保存失敗。
 */
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { User } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
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
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { signInWithEmailPassword, signUpWithEmailPassword } from '../../auth/signInWithEmail';
import { AppIcon } from '../../components/AppIcon';
import BackButton from '../../components/BackButton';
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
import { supabase } from '../../lib/supabase';
import { syncNow } from '../../sync/syncNow';
import { useResponsiveLayout } from '../../ui/responsive';
import { useTheme, useThemedStyles } from '../../ui/theme';

type TimeField = 'morning' | 'night';

// Shared entrance animation for card sections (staggered on mount). / カードセクションの登場アニメ（順次表示）。
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
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme, preference, setPreference } = useTheme();
  const responsive = useResponsiveLayout();
  const styles = useThemedStyles((theme, cardShadow) =>
    StyleSheet.create({
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
      linkList: {
        marginTop: theme.spacing.sm,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        overflow: 'hidden',
      },
      linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        gap: theme.spacing.sm,
      },
      linkRowDivider: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      },
      linkRowPressed: {
        opacity: 0.85,
      },
      linkText: {
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
      actionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
      },
      actionButton: {
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.accentSoft,
      },
      actionButtonPressed: {
        opacity: 0.85,
      },
      actionButtonText: {
        fontWeight: '700',
        color: theme.colors.accentDark,
        fontFamily: theme.font.body,
      },
      actionButtonOutline: {
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      },
      actionButtonOutlineText: {
        fontWeight: '700',
        color: theme.colors.ink,
        fontFamily: theme.font.body,
      },
      authInput: {
        minHeight: 44,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingHorizontal: 12,
        backgroundColor: theme.colors.surface,
        color: theme.colors.ink,
        fontFamily: theme.font.body,
      },
      authStatus: {
        color: theme.colors.inkMuted,
        fontFamily: theme.font.body,
        marginTop: theme.spacing.sm,
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
    }),
  );
  const [loading, setLoading] = useState(true);
  const [settings, setLocalSettings] = useState(DEFAULT_SETTINGS);
  const [morningInput, setMorningInput] = useState(DEFAULT_SETTINGS.notifications.morningTime);
  const [nightInput, setNightInput] = useState(DEFAULT_SETTINGS.notifications.nightTime);
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showNightPicker, setShowNightPicker] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [syncBusy, setSyncBusy] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [languagePref, setLanguagePref] = useState<LanguagePreference>('system');

  const headerAnim = useRef(new Animated.Value(0)).current;
  const notifyAnim = useRef(new Animated.Value(0)).current;
  const timeAnim = useRef(new Animated.Value(0)).current;
  const resetAnim = useRef(new Animated.Value(0)).current;

  // Load settings and normalize local editable state. / 設定を読み込みローカル編集状態へ反映。
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

  // Initial data fetch for settings. / 設定の初回取得。
  useEffect(() => {
    void load();
  }, [load]);

  // Load language preference separately (for local selection UI). / 言語設定を別途取得。
  useEffect(() => {
    getLanguagePreference().then(setLanguagePref);
  }, []);

  // Track Supabase auth session for sync UI. / Supabase認証セッションを監視。
  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          setAuthNotice(t('settings.sync.sessionFail'));
          return;
        }
        setAuthUser(data.user ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthNotice(t('settings.sync.sessionFail'));
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [t]);

  // Stagger in header/sections once on mount. / ヘッダー/セクションの順次表示。
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
  const appExtra = (Constants.expoConfig?.extra ?? {}) as {
    privacyPolicyUrl?: string;
    contactUrl?: string;
  };
  const privacyPolicyUrl = appExtra.privacyPolicyUrl ?? '';
  const contactUrl = appExtra.contactUrl ?? '';

  // Validate "HH:mm" time input from manual edits/pickers. / "HH:mm"形式の検証。
  const validateTime = (value: string) => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
  };

  // Convert Date -> "HH:mm" for display and storage. / Dateから"HH:mm"へ変換。
  const toTimeString = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Convert "HH:mm" -> Date (today), with fallback for invalid values. / "HH:mm"を今日の日付へ変換（不正はフォールバック）。
  const timeToDate = (time: string) => {
    if (!validateTime(time)) return new Date();
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
  };

  // Persist settings locally and in storage. / ローカルとストレージに設定を保存。
  const persistSettings = async (next: typeof settings) => {
    setLocalSettings(next);
    await setSettings(next);
  };

  // Apply time change and reschedule reminders if enabled. / 時刻変更を適用し、必要なら通知再予約。
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

  // Wire picker changes to state and persistence. / ピッカー変更を状態/保存に反映。
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

  // Turn reminders on/off and sync with OS permission state. / 通知ON/OFFと権限状態の同期。
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

  // Deep-link to app settings for permission recovery. / 権限復旧のため設定画面へ。
  const openSystemSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      setNotice(t('settings.systemSettingsFail'));
    }
  };

  // Open privacy policy in an in-app browser. / プライバシーポリシーをブラウザで開く。
  const openPrivacyPolicy = async () => {
    if (!privacyPolicyUrl) {
      setNotice(t('settings.legal.missingUrl'));
      return;
    }
    try {
      await WebBrowser.openBrowserAsync(privacyPolicyUrl);
    } catch {
      setNotice(t('settings.legal.openFail'));
    }
  };

  // Open external contact page in an in-app browser. / お問い合わせページをブラウザで開く。
  const openContactPage = async () => {
    if (!contactUrl) {
      setNotice(t('settings.contact.missingUrl'));
      return;
    }
    try {
      await WebBrowser.openBrowserAsync(contactUrl);
    } catch {
      setNotice(t('settings.contact.openFail'));
    }
  };

  const handleSignIn = async () => {
    setAuthNotice(null);
    const email = authEmail.trim();
    if (!email) {
      setAuthNotice(t('settings.sync.emailRequired'));
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setAuthNotice(t('settings.sync.emailInvalid'));
      return;
    }
    if (!authPassword) {
      setAuthNotice(t('settings.sync.passwordRequired'));
      return;
    }
    setAuthBusy(true);
    try {
      await signInWithEmailPassword(email, authPassword);
      setAuthNotice(t('settings.sync.signInSuccess'));
    } catch (err) {
      console.error('Failed to sign in.', err);
      setAuthNotice(t('settings.sync.signInFail'));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignUp = async () => {
    setAuthNotice(null);
    const email = authEmail.trim();
    if (!email) {
      setAuthNotice(t('settings.sync.emailRequired'));
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setAuthNotice(t('settings.sync.emailInvalid'));
      return;
    }
    if (!authPassword || authPassword.length < 8) {
      setAuthNotice(t('settings.sync.passwordWeak'));
      return;
    }
    setAuthBusy(true);
    try {
      await signUpWithEmailPassword(email, authPassword);
      setAuthNotice(t('settings.sync.signUpSuccess'));
    } catch (err) {
      console.error('Failed to sign up.', err);
      setAuthNotice(t('settings.sync.signUpFail'));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    setAuthNotice(null);
    setAuthBusy(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Failed to sign out.', err);
      setAuthNotice(t('settings.sync.signOutFail'));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSyncNow = async () => {
    setAuthNotice(null);
    if (!authUser) {
      setAuthNotice(t('settings.sync.signInRequired'));
      return;
    }
    setSyncBusy(true);
    try {
      await syncNow();
      setAuthNotice(t('settings.sync.syncSuccess'));
    } catch (err) {
      console.error('Failed to sync.', err);
      setAuthNotice(t('settings.sync.syncFail'));
    } finally {
      setSyncBusy(false);
    }
  };

  // Confirm and execute a full progress reset. / 進捗の全リセット確認と実行。
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

  // Derived labels for status chips and rows. / ステータス表示用ラベル。
  const settingsSummary = useMemo(() => {
    return reminderEnabled ? t('settings.notifications.on') : t('settings.notifications.off');
  }, [reminderEnabled, t]);

  const authStatus = useMemo(() => {
    if (!authUser) return t('settings.sync.signedOut');
    if (authUser.email) return t('settings.sync.signedIn', { email: authUser.email });
    return t('settings.sync.signedInNoEmail');
  }, [authUser, t]);

  // Display options for language selection. / 言語選択の表示オプション。
  const languageOptions = useMemo(
    () => [
      { value: 'system' as const, label: t('settings.language.system') },
      { value: 'ja' as const, label: t('settings.language.japanese') },
      { value: 'en' as const, label: t('settings.language.english') },
    ],
    [t],
  );

  // Display options for theme selection. / テーマ選択の表示オプション。
  const themeOptions = useMemo(
    () => [
      { value: 'system' as const, label: t('settings.theme.system') },
      { value: 'light' as const, label: t('settings.theme.light') },
      { value: 'dark' as const, label: t('settings.theme.dark') },
    ],
    [t],
  );

  // Save language preference and switch i18n locale. / 言語設定を保存してi18n切替。
  const handleLanguageSelect = async (value: LanguagePreference) => {
    setLanguagePref(value);
    await setLanguagePreference(value);
  };

  // Load-state and error-state gates before main UI. / ロード/エラー状態の分岐。
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingWrap}>
          <BackButton style={styles.backButton} />
          <View style={styles.loading}>
            <Text style={styles.loadingText}>{t('common.loadingSimple')}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (fatalError) {
    return <ErrorState message={fatalError} onRetry={load} showBack />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <BackButton />
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
          <Text style={styles.sectionTitle}>{t('settings.sync.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.sync.description')}</Text>
          <Text style={styles.authStatus}>{authStatus}</Text>
          {!!authNotice && <Text style={styles.sectionHint}>{authNotice}</Text>}

          <View style={styles.actionRow}>
            {!authUser ? (
              <View style={{ flex: 1 }}>
                <TextInput
                  value={authEmail}
                  onChangeText={setAuthEmail}
                  placeholder={t('settings.sync.emailPlaceholder')}
                  placeholderTextColor={theme.colors.inkMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.authInput}
                />
                <TextInput
                  value={authPassword}
                  onChangeText={setAuthPassword}
                  placeholder={t('settings.sync.passwordPlaceholder')}
                  placeholderTextColor={theme.colors.inkMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.authInput, { marginTop: theme.spacing.sm }]}
                />
                <Pressable
                  onPress={handleSignIn}
                  disabled={authBusy}
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.actionButtonPressed,
                    { marginTop: theme.spacing.sm },
                  ]}
                >
                  <Text style={styles.actionButtonText}>{t('settings.sync.signIn')}</Text>
                </Pressable>
                <Pressable
                  onPress={handleSignUp}
                  disabled={authBusy}
                  style={({ pressed }) => [
                    styles.actionButtonOutline,
                    pressed && styles.actionButtonPressed,
                    { marginTop: theme.spacing.sm },
                  ]}
                >
                  <Text style={styles.actionButtonOutlineText}>
                    {t('settings.sync.signUp')}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handleSignOut}
                disabled={authBusy}
                style={({ pressed }) => [
                  styles.actionButtonOutline,
                  pressed && styles.actionButtonPressed,
                ]}
              >
                <Text style={styles.actionButtonOutlineText}>{t('settings.sync.signOut')}</Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleSyncNow}
              disabled={syncBusy || authBusy}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}
            >
              <Text style={styles.actionButtonText}>{t('settings.sync.syncNow')}</Text>
            </Pressable>
          </View>
        </Animated.View>

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
          <Text style={styles.sectionTitle}>{t('settings.theme.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.theme.description')}</Text>

          <View style={styles.optionList}>
            {themeOptions.map((option, index) => (
              <Pressable
                key={option.value}
                onPress={() => setPreference(option.value)}
                style={({ pressed }) => [
                  styles.optionRow,
                  index > 0 && styles.optionRowDivider,
                  pressed && styles.optionRowPressed,
                ]}
              >
                <View style={styles.radioOuter}>
                  {preference === option.value && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
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
          <Text style={styles.sectionTitle}>{t('settings.updates.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.updates.body')}</Text>
          <View style={styles.linkList}>
            <Pressable
              onPress={() => router.push('/updates')}
              style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}
            >
              <Text style={styles.linkText}>{t('settings.updates.open')}</Text>
              <AppIcon name="arrow-forward" size={18} color={theme.colors.inkMuted} />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, entranceStyle(resetAnim)]}>
          <Text style={styles.sectionTitle}>{t('settings.legal.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.legal.body')}</Text>
          <View style={styles.linkList}>
            <Pressable
              onPress={openPrivacyPolicy}
              style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}
            >
              <Text style={styles.linkText}>{t('settings.legal.privacy')}</Text>
              <AppIcon name="arrow-ne" size={18} color={theme.colors.inkMuted} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/licenses')}
              style={({ pressed }) => [
                styles.linkRow,
                styles.linkRowDivider,
                pressed && styles.linkRowPressed,
              ]}
            >
              <Text style={styles.linkText}>{t('settings.legal.licenses')}</Text>
              <AppIcon name="arrow-forward" size={18} color={theme.colors.inkMuted} />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, entranceStyle(resetAnim)]}>
          <Text style={styles.sectionTitle}>{t('settings.contact.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.contact.body')}</Text>
          <View style={styles.linkList}>
            <Pressable
              onPress={openContactPage}
              style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]}
            >
              <Text style={styles.linkText}>{t('settings.contact.open')}</Text>
              <AppIcon name="arrow-ne" size={18} color={theme.colors.inkMuted} />
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

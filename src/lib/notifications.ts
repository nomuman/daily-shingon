/**
 * Purpose: Local notification scheduling helpers. / 目的: ローカル通知スケジューリングのヘルパー。
 * Responsibilities: request permissions, configure Android channel, schedule/cancel daily reminders. / 役割: 権限要求、Androidチャンネル設定、日次通知の予約/解除。
 * Inputs: reminder times (HH:mm) and translated copy. / 入力: 通知時刻（HH:mm）と翻訳文言。
 * Outputs: scheduled notification IDs and permission status. / 出力: 通知IDと権限状態。
 * Dependencies: expo-notifications, i18n instance, Platform API. / 依存: expo-notifications、i18n、Platform API。
 * Side effects: OS notification permission prompts and schedule changes. / 副作用: OSの権限ダイアログ、スケジュール変更。
 * Edge cases: invalid time strings, i18n not initialized, Android-only channel setup. / 例外: 時刻不正、i18n未初期化、Androidのみのチャンネル設定。
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { getI18n } from './i18n';

export type NotificationIds = {
  morningId?: string;
  nightId?: string;
};

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

const ANDROID_CHANNEL_ID = 'dailyshingon-reminders';

// i18n-safe translator with fallback to avoid raw keys. / キーそのまま表示を避けるフォールバック付き翻訳。
const translate = (key: string, fallback: string) => {
  const i18n = getI18n();
  if (!i18n.isInitialized) return fallback;
  const value = i18n.t(key);
  return value === key ? fallback : value;
};

// Build user-visible copy for reminders. / 通知表示文言の生成。
const getNotificationCopy = () => ({
  channelName: translate('notifications.channelName', 'Daily reminders'),
  morningTitle: translate('notifications.morning.title', 'Morning reset'),
  morningBody: translate(
    'notifications.morning.body',
    'Take 3 minutes to align body, speech, and mind.',
  ),
  nightTitle: translate('notifications.night.title', 'Night close'),
  nightBody: translate('notifications.night.body', 'Close the day in 45 seconds.'),
});

// Android requires a notification channel for scheduled reminders. / Androidでは通知チャンネルが必要。
export async function configureNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const copy = getNotificationCopy();
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: copy.channelName,
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

// Ensure permission and return the resulting status. / 権限を確認し結果を返す。
export async function ensureNotificationPermission(): Promise<PermissionStatus> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return 'granted';

  const requested = await Notifications.requestPermissionsAsync();
  return requested.status;
}

// Convert HH:mm to scheduler trigger parts. / HH:mmをトリガー値に変換。
export function parseTimeToTrigger(time: string): { hour: number; minute: number } | null {
  const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return { hour, minute };
}

// Schedule two daily notifications and return their IDs. / 日次通知2件を予約しIDを返す。
export async function scheduleDailyReminders(
  morningTime: string,
  nightTime: string,
): Promise<NotificationIds> {
  await configureNotificationChannel();
  const copy = getNotificationCopy();

  const morningTrigger = parseTimeToTrigger(morningTime);
  const nightTrigger = parseTimeToTrigger(nightTime);
  if (!morningTrigger || !nightTrigger) {
    throw new Error('Invalid notification time');
  }

  const morningId = await Notifications.scheduleNotificationAsync({
    content: {
      title: copy.morningTitle,
      body: copy.morningBody,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      ...morningTrigger,
      channelId: ANDROID_CHANNEL_ID,
    },
  });

  const nightId = await Notifications.scheduleNotificationAsync({
    content: {
      title: copy.nightTitle,
      body: copy.nightBody,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      ...nightTrigger,
      channelId: ANDROID_CHANNEL_ID,
    },
  });

  return { morningId, nightId };
}

// Cancel scheduled notifications by ID. / ID指定で通知をキャンセル。
export async function cancelDailyReminders(ids: NotificationIds): Promise<void> {
  const tasks: Promise<void>[] = [];
  if (ids.morningId) {
    tasks.push(Notifications.cancelScheduledNotificationAsync(ids.morningId));
  }
  if (ids.nightId) {
    tasks.push(Notifications.cancelScheduledNotificationAsync(ids.nightId));
  }
  await Promise.all(tasks);
}

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type NotificationIds = {
  morningId?: string;
  nightId?: string;
};

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

const ANDROID_CHANNEL_ID = 'sanmitsu-reminders';

export async function configureNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Daily reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function ensureNotificationPermission(): Promise<PermissionStatus> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return 'granted';

  const requested = await Notifications.requestPermissionsAsync();
  return requested.status;
}

export function parseTimeToTrigger(time: string): { hour: number; minute: number } | null {
  const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return { hour, minute };
}

export async function scheduleDailyReminders(
  morningTime: string,
  nightTime: string
): Promise<NotificationIds> {
  await configureNotificationChannel();

  const morningTrigger = parseTimeToTrigger(morningTime);
  const nightTrigger = parseTimeToTrigger(nightTime);
  if (!morningTrigger || !nightTrigger) {
    throw new Error('Invalid notification time');
  }

  const morningId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '朝の整え',
      body: '3分だけ整えよう（身・口・意）',
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
      title: '夜のしめ',
      body: '45秒で閉じよう（懺悔→発願→回向）',
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

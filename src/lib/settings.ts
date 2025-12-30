import { getJSON, setJSON } from './storage';

export type NotificationSettings = {
  enabled: boolean;
  morningTime: string; // HH:mm
  nightTime: string; // HH:mm
  morningId?: string;
  nightId?: string;
  permissionStatus?: 'granted' | 'denied' | 'undetermined';
};

export type AppSettings = {
  notifications: NotificationSettings;
};

const SETTINGS_KEY = '@sanmitsu/settings';

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    enabled: false,
    morningTime: '07:30',
    nightTime: '21:30',
  },
};

export async function getSettings(): Promise<AppSettings> {
  const saved = await getJSON<AppSettings>(SETTINGS_KEY);
  if (!saved) return DEFAULT_SETTINGS;

  return {
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...saved.notifications,
    },
  };
}

export async function setSettings(settings: AppSettings): Promise<void> {
  await setJSON(SETTINGS_KEY, settings);
}

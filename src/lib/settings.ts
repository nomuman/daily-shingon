/**
 * Purpose: Persistent app settings (notifications). / 目的: 永続化するアプリ設定（通知）。
 * Responsibilities: define default settings and get/set storage helpers. / 役割: 既定値定義と取得/保存。
 * Inputs: AppSettings objects. / 入力: AppSettingsオブジェクト。
 * Outputs: merged settings with defaults applied. / 出力: 既定値をマージした設定。
 * Dependencies: storage helpers. / 依存: ストレージヘルパー。
 * Side effects: reads/writes AsyncStorage. / 副作用: AsyncStorage読書き。
 * Edge cases: missing saved settings fall back to defaults. / 例外: 保存設定なしは既定値へ。
 */
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

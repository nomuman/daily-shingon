import type { SanmitsuKey } from '../types/curriculum';
import { markActive } from './engagement';
import { toISODateLocal } from './date';
import { getJSON, removeItem, setJSON } from './storage';

export type TodayActionSelection = {
  selectedKey: SanmitsuKey;
  selectedText: string;
  // いつ保存されたか（デバッグ用/将来拡張用）
  savedAtISO: string; // ISO datetime
};

const KEY_PREFIX = 'todayLog:action:'; // + YYYY-MM-DD

function keyFor(date = new Date()): string {
  return `${KEY_PREFIX}${toISODateLocal(date)}`;
}

export async function getTodayActionSelection(
  date = new Date(),
): Promise<TodayActionSelection | null> {
  return getJSON<TodayActionSelection>(keyFor(date));
}

export async function setTodayActionSelection(
  selection: Omit<TodayActionSelection, 'savedAtISO'>,
  date = new Date(),
): Promise<void> {
  const k = keyFor(date);
  const payload: TodayActionSelection = {
    ...selection,
    savedAtISO: date.toISOString(),
  };
  // AsyncStorage は value が string なので JSON.stringify で保存
  await setJSON(k, payload);
  await markActive(date);
}

export async function clearTodayActionSelection(date = new Date()): Promise<void> {
  await removeItem(keyFor(date));
}

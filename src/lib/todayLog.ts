import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SanmitsuKey } from '../types/curriculum';

export type TodayActionSelection = {
  selectedKey: SanmitsuKey;
  selectedText: string;
  // いつ保存されたか（デバッグ用/将来拡張用）
  savedAtISO: string; // ISO datetime
};

const KEY_PREFIX = 'todayLog:action:'; // + YYYY-MM-DD

function toISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function keyFor(date = new Date()): string {
  return `${KEY_PREFIX}${toISODateLocal(date)}`;
}

export async function getTodayActionSelection(date = new Date()): Promise<TodayActionSelection | null> {
  const k = keyFor(date);
  const raw = await AsyncStorage.getItem(k);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TodayActionSelection;
  } catch {
    // 破損してたら消しておく（クラッシュ回避）
    await AsyncStorage.removeItem(k);
    return null;
  }
}

export async function setTodayActionSelection(
  selection: Omit<TodayActionSelection, 'savedAtISO'>,
  date = new Date()
): Promise<void> {
  const k = keyFor(date);
  const payload: TodayActionSelection = {
    ...selection,
    savedAtISO: new Date().toISOString(),
  };
  // AsyncStorage は value が string なので JSON.stringify で保存
  await AsyncStorage.setItem(k, JSON.stringify(payload));
}

export async function clearTodayActionSelection(date = new Date()): Promise<void> {
  await AsyncStorage.removeItem(keyFor(date));
}

import AsyncStorage from '@react-native-async-storage/async-storage';

export type NightLog = {
  dateISO: string; // YYYY-MM-DD（ローカル日付）
  sangeDone: boolean; // 懺悔
  hotsuganDone: boolean; // 発願
  ekouDone: boolean; // 回向
  note: string; // 任意メモ（短文）
  savedAtISO: string; // ISO datetime
};

const KEY_PREFIX = 'nightLog:'; // + YYYY-MM-DD

function toISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function keyFor(date = new Date()): string {
  return `${KEY_PREFIX}${toISODateLocal(date)}`;
}

export function isNightComplete(log: NightLog | null): boolean {
  if (!log) return false;
  return log.sangeDone && log.hotsuganDone && log.ekouDone;
}

export async function getNightLog(date = new Date()): Promise<NightLog | null> {
  const raw = await AsyncStorage.getItem(keyFor(date));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as NightLog;
  } catch {
    await AsyncStorage.removeItem(keyFor(date));
    return null;
  }
}

export async function setNightLog(
  input: Omit<NightLog, 'savedAtISO' | 'dateISO'> & { date?: Date }
): Promise<void> {
  const date = input.date ?? new Date();
  const payload: NightLog = {
    dateISO: toISODateLocal(date),
    sangeDone: input.sangeDone,
    hotsuganDone: input.hotsuganDone,
    ekouDone: input.ekouDone,
    note: input.note ?? '',
    savedAtISO: new Date().toISOString(),
  };

  await AsyncStorage.setItem(keyFor(date), JSON.stringify(payload));
}

export async function clearNightLog(date = new Date()): Promise<void> {
  await AsyncStorage.removeItem(keyFor(date));
}

import { markActive } from './engagement';
import { toISODateLocal } from './date';
import { getJSON, removeItem, setJSON } from './storage';

export type NightLog = {
  dateISO: string; // YYYY-MM-DD（ローカル日付）
  sangeDone: boolean; // 懺悔
  hotsuganDone: boolean; // 発願
  ekouDone: boolean; // 回向
  note: string; // 任意メモ（短文）
  savedAtISO: string; // ISO datetime
};

const KEY_PREFIX = 'nightLog:'; // + YYYY-MM-DD

function keyFor(date = new Date()): string {
  return `${KEY_PREFIX}${toISODateLocal(date)}`;
}

export function isNightComplete(log: NightLog | null): boolean {
  if (!log) return false;
  return log.sangeDone && log.hotsuganDone && log.ekouDone;
}

export async function getNightLog(date = new Date()): Promise<NightLog | null> {
  return getJSON<NightLog>(keyFor(date));
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

  await setJSON(keyFor(date), payload);
  await markActive(date);
}

export async function clearNightLog(date = new Date()): Promise<void> {
  await removeItem(keyFor(date));
}

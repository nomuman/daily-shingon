import { markActive } from './engagement';
import { toISODateLocal } from './date';
import { getJSON, removeItem, setJSON } from './storage';

export type MorningLog = {
  dateISO: string; // YYYY-MM-DD（ローカル日付）
  bodyDone: boolean;
  speechDone: boolean;
  mindDone: boolean;
  savedAtISO: string; // ISO datetime
};

const KEY_PREFIX = 'morningLog:'; // + YYYY-MM-DD

function keyFor(date = new Date()): string {
  return `${KEY_PREFIX}${toISODateLocal(date)}`;
}

export function isMorningComplete(log: MorningLog | null): boolean {
  if (!log) return false;
  return log.bodyDone && log.speechDone && log.mindDone;
}

export async function getMorningLog(date = new Date()): Promise<MorningLog | null> {
  return getJSON<MorningLog>(keyFor(date));
}

export async function setMorningLog(
  input: Omit<MorningLog, 'savedAtISO' | 'dateISO'> & { date?: Date },
): Promise<void> {
  const date = input.date ?? new Date();
  const payload: MorningLog = {
    dateISO: toISODateLocal(date),
    bodyDone: input.bodyDone,
    speechDone: input.speechDone,
    mindDone: input.mindDone,
    savedAtISO: new Date().toISOString(),
  };

  await setJSON(keyFor(date), payload);
  await markActive(date);
}

export async function clearMorningLog(date = new Date()): Promise<void> {
  await removeItem(keyFor(date));
}

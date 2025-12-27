import AsyncStorage from '@react-native-async-storage/async-storage';

export type MorningLog = {
  dateISO: string; // YYYY-MM-DD（ローカル日付）
  bodyDone: boolean;
  speechDone: boolean;
  mindDone: boolean;
  savedAtISO: string; // ISO datetime
};

const KEY_PREFIX = 'morningLog:'; // + YYYY-MM-DD

function toISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function keyFor(date = new Date()): string {
  return `${KEY_PREFIX}${toISODateLocal(date)}`;
}

export function isMorningComplete(log: MorningLog | null): boolean {
  if (!log) return false;
  return log.bodyDone && log.speechDone && log.mindDone;
}

export async function getMorningLog(date = new Date()): Promise<MorningLog | null> {
  const raw = await AsyncStorage.getItem(keyFor(date));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MorningLog;
  } catch {
    // 破損してたら削除（クラッシュ回避）
    await AsyncStorage.removeItem(keyFor(date));
    return null;
  }
}

export async function setMorningLog(
  input: Omit<MorningLog, 'savedAtISO' | 'dateISO'> & { date?: Date }
): Promise<void> {
  const date = input.date ?? new Date();
  const payload: MorningLog = {
    dateISO: toISODateLocal(date),
    bodyDone: input.bodyDone,
    speechDone: input.speechDone,
    mindDone: input.mindDone,
    savedAtISO: new Date().toISOString(),
  };

  await AsyncStorage.setItem(keyFor(date), JSON.stringify(payload));
}

export async function clearMorningLog(date = new Date()): Promise<void> {
  await AsyncStorage.removeItem(keyFor(date));
}

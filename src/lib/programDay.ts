import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_START_DATE = 'curriculum30:startDateISO'; // "YYYY-MM-DD"

function toISODateLocal(d: Date): string {
  // local timezone で YYYY-MM-DD を作る
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseISODateLocal(iso: string): Date {
  // "YYYY-MM-DD" をローカル日付として解釈
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

function diffDays(a: Date, b: Date): number {
  // a - b の日数（ローカルの0時基準）
  const a0 = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const b0 = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.floor((a0 - b0) / 86400000);
}

export type ProgramDayInfo = {
  startDateISO: string;
  dayNumber: number; // 1..30（30以降は30に固定）
  isComplete: boolean; // day > 30
};

export async function getProgramDayInfo(today = new Date()): Promise<ProgramDayInfo> {
  let startISO = await AsyncStorage.getItem(KEY_START_DATE);

  if (!startISO) {
    startISO = toISODateLocal(today);
    await AsyncStorage.setItem(KEY_START_DATE, startISO);
  }

  const start = parseISODateLocal(startISO);
  const daysSinceStart = diffDays(today, start); // 0ならDay1
  const rawDay = daysSinceStart + 1;

  return {
    startDateISO: startISO,
    dayNumber: Math.max(1, Math.min(30, rawDay)),
    isComplete: rawDay > 30,
  };
}

export async function resetProgramStartDate(today = new Date()): Promise<void> {
  await AsyncStorage.setItem(KEY_START_DATE, toISODateLocal(today));
}

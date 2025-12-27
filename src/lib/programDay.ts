import { diffDays, parseISODateLocal, toISODateLocal } from './date';
import { getString, setString } from './storage';

export const KEY_START_DATE = 'curriculum30:startDateISO'; // "YYYY-MM-DD"

export type ProgramDayInfo = {
  startDateISO: string;
  dayNumber: number; // 1..30（30以降は30に固定）
  isComplete: boolean; // day > 30
};

export async function getProgramDayInfo(today = new Date()): Promise<ProgramDayInfo> {
  let startISO = await getString(KEY_START_DATE);

  if (!startISO) {
    startISO = toISODateLocal(today);
    await setString(KEY_START_DATE, startISO);
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
  await setString(KEY_START_DATE, toISODateLocal(today));
}

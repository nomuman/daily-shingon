import { toISODateLocal } from './date';
import { getMorningLog, isMorningComplete } from './morningLog';
import { getNightLog, isNightComplete } from './nightLog';

export type DailyStatus = {
  dateISO: string; // YYYY-MM-DD (local)
  morningDone: boolean;
  nightDone: boolean;
  nightHasNote: boolean;
};

function addDays(base: Date, deltaDays: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + deltaDays);
  return d;
}

/**
 * 直近N日分（今日含む）の朝/夜ステータスを返す（新しい順）
 */
export async function getLastNDaysStatus(
  days: number,
  baseDate = new Date()
): Promise<DailyStatus[]> {
  const n = Math.max(1, Math.min(days, 31));
  const items: DailyStatus[] = [];

  for (let i = 0; i < n; i += 1) {
    const date = addDays(baseDate, -i);
    const dateISO = toISODateLocal(date);

    const morning = await getMorningLog(date);
    const night = await getNightLog(date);

    items.push({
      dateISO,
      morningDone: isMorningComplete(morning),
      nightDone: isNightComplete(night),
      nightHasNote: !!(night?.note && night.note.trim().length > 0),
    });
  }

  return items;
}

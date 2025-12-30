/**
 * Purpose: Build recent-day status summaries for UI. / 目的: 直近日の状態サマリーを生成。
 * Responsibilities: aggregate morning/night completion and note presence. / 役割: 朝/夜の完了とメモ有無を集計。
 * Inputs: number of days and optional base date. / 入力: 日数と基準日。
 * Outputs: array of DailyStatus (newest first). / 出力: DailyStatus配列（新しい順）。
 * Dependencies: date helpers and log storage. / 依存: 日付ヘルパー、ログストレージ。
 * Side effects: reads from AsyncStorage. / 副作用: AsyncStorage読込。
 * Edge cases: days clamped to 1..31 to limit work. / 例外: 日数は1..31に制限。
 */
import { toISODateLocal } from './date';
import { getMorningLog, isMorningComplete } from './morningLog';
import { getNightLog, isNightComplete } from './nightLog';

export type DailyStatus = {
  dateISO: string; // YYYY-MM-DD (local)
  morningDone: boolean;
  nightDone: boolean;
  nightHasNote: boolean;
};

// Add (or subtract) days from a base date. / 基準日に日数を加減。
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
  baseDate = new Date(),
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

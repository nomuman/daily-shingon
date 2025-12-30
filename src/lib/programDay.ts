/**
 * Purpose: Track the 30-day program start date and current day number. / 目的: 30日プログラムの開始日と現在日を管理。
 * Responsibilities: persist start date, compute day number, and reset start date. / 役割: 開始日保存、日数計算、開始日リセット。
 * Inputs: optional "today" Date. / 入力: 任意の今日の日付。
 * Outputs: ProgramDayInfo with day number and completion flag. / 出力: 日数と完了フラグを持つProgramDayInfo。
 * Dependencies: date helpers and storage helpers. / 依存: 日付ヘルパー、ストレージヘルパー。
 * Side effects: reads/writes AsyncStorage. / 副作用: AsyncStorage読書き。
 * Edge cases: missing start date initializes to today; day clamped to 1..30. / 例外: 開始日未設定は今日に初期化、日数は1..30に丸め。
 */
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

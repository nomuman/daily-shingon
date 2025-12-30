/**
 * Purpose: Storage helpers for night reflection logs. / 目的: 夜の振り返りログの保存ヘルパー。
 * Responsibilities: read/write/clear daily night logs and compute completion. / 役割: 日次ログの読込/保存/削除と完了判定。
 * Inputs: date, step flags, optional note. / 入力: 日付、ステップフラグ、任意メモ。
 * Outputs: persisted NightLog records. / 出力: 保存されたNightLog。
 * Dependencies: storage helpers, date utils, engagement tracking. / 依存: ストレージ、日付ユーティリティ、エンゲージメント。
 * Side effects: writes to AsyncStorage and updates engagement activity. / 副作用: AsyncStorage書込、アクティブ日更新。
 * Edge cases: missing log returns null; completion false when any step is false. / 例外: ログなしはnull、いずれか未完でfalse。
 */
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

// Storage key prefix per date. / 日付別のキー接頭辞。
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
  input: Omit<NightLog, 'savedAtISO' | 'dateISO'> & { date?: Date },
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

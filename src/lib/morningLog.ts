/**
 * Purpose: Storage helpers for morning check-in logs. / 目的: 朝チェックインログの保存ヘルパー。
 * Responsibilities: read/write/clear daily morning logs and compute completion. / 役割: 日次ログの読込/保存/削除と完了判定。
 * Inputs: date and log flags. / 入力: 日付とフラグ。
 * Outputs: persisted MorningLog records. / 出力: 保存されたMorningLog。
 * Dependencies: storage helpers, date utils, engagement tracking. / 依存: ストレージ、日付ユーティリティ、エンゲージメント。
 * Side effects: writes to AsyncStorage and updates engagement activity. / 副作用: AsyncStorage書込、アクティブ日更新。
 * Edge cases: missing log returns null; completion false when any flag is false. / 例外: ログなしはnull、いずれか未完でfalse。
 */
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

// Storage key prefix per date. / 日付別のキー接頭辞。
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

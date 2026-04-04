/**
 * Purpose: Persist whether today's learning card has been completed. / 目的: その日の学び完了状態を保存。
 * Responsibilities: read/write/clear daily learn completion records. / 役割: 日次の学び完了レコードの読込/保存/削除。
 * Inputs: optional target date. / 入力: 任意の対象日。
 * Outputs: persisted LearnLog records or completion boolean. / 出力: LearnLogレコードまたは完了判定。
 * Dependencies: storage helpers, date utils, engagement tracking. / 依存: ストレージ、日付ユーティリティ、エンゲージメント。
 * Side effects: AsyncStorage writes and active-date updates. / 副作用: AsyncStorage書込とアクティブ日更新。
 * Edge cases: missing log returns null. / 例外: ログ未保存時はnull。
 */
import { markActive } from './engagement';
import { toISODateLocal } from './date';
import { getJSON, removeItem, setJSON } from './storage';

export type LearnLog = {
  dateISO: string; // YYYY-MM-DD（ローカル日付）
  savedAtISO: string; // ISO datetime
};

const KEY_PREFIX = 'learnLog:'; // + YYYY-MM-DD

function keyFor(date = new Date()): string {
  return `${KEY_PREFIX}${toISODateLocal(date)}`;
}

export function isLearnComplete(log: LearnLog | null): boolean {
  return !!log;
}

export async function getLearnLog(date = new Date()): Promise<LearnLog | null> {
  return getJSON<LearnLog>(keyFor(date));
}

export async function setLearnLog(date = new Date()): Promise<void> {
  const payload: LearnLog = {
    dateISO: toISODateLocal(date),
    savedAtISO: new Date().toISOString(),
  };

  await setJSON(keyFor(date), payload);
  await markActive(date);
}

export async function clearLearnLog(date = new Date()): Promise<void> {
  await removeItem(keyFor(date));
}

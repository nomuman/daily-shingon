/**
 * Purpose: Storage helpers for "today's action" selection. / 目的: 今日の行い選択の保存ヘルパー。
 * Responsibilities: read/write/clear daily selected action. / 役割: 日次の選択を読込/保存/削除。
 * Inputs: selected action key/text and date. / 入力: 選択キー/テキストと日付。
 * Outputs: persisted selection record. / 出力: 保存された選択レコード。
 * Dependencies: storage helpers, date utils, engagement tracking. / 依存: ストレージ、日付ユーティリティ、エンゲージメント。
 * Side effects: writes to AsyncStorage and updates engagement activity. / 副作用: AsyncStorage書込、アクティブ日更新。
 * Edge cases: missing selection returns null. / 例外: 選択なしはnull。
 */
import type { SanmitsuKey } from '../types/curriculum';
import { markActive } from './engagement';
import { toISODateLocal } from './date';
import { getJSON, removeItem, setJSON } from './storage';

export type TodayActionSelection = {
  selectedKey: SanmitsuKey;
  selectedText: string;
  // いつ保存されたか（デバッグ用/将来拡張用）
  savedAtISO: string; // ISO datetime
};

// Storage key prefix per date. / 日付別のキー接頭辞。
const KEY_PREFIX = 'todayLog:action:'; // + YYYY-MM-DD

function keyFor(date = new Date()): string {
  return `${KEY_PREFIX}${toISODateLocal(date)}`;
}

export async function getTodayActionSelection(
  date = new Date(),
): Promise<TodayActionSelection | null> {
  return getJSON<TodayActionSelection>(keyFor(date));
}

export async function setTodayActionSelection(
  selection: Omit<TodayActionSelection, 'savedAtISO'>,
  date = new Date(),
): Promise<void> {
  const k = keyFor(date);
  const payload: TodayActionSelection = {
    ...selection,
    savedAtISO: date.toISOString(),
  };
  // AsyncStorage stores strings, so we JSON-serialize the payload. / AsyncStorageは文字列保存のためJSON化。
  await setJSON(k, payload);
  await markActive(date);
}

export async function clearTodayActionSelection(date = new Date()): Promise<void> {
  await removeItem(keyFor(date));
}

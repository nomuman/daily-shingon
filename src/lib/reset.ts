/**
 * Purpose: Reset helpers for clearing user progress. / 目的: ユーザー進捗のリセットヘルパー。
 * Responsibilities: remove program start date, last active date, and daily logs. / 役割: 開始日/最終アクティブ日/日次ログを削除。
 * Inputs: none. / 入力: なし。
 * Outputs: cleared storage keys. / 出力: 削除されたストレージキー。
 * Dependencies: engagement/programDay keys and storage helpers. / 依存: engagement/programDayキー、ストレージヘルパー。
 * Side effects: destructive removal of stored progress. / 副作用: 進捗データの破壊的削除。
 * Edge cases: no matching keys (no-op). / 例外: 該当キーなしは無処理。
 */
import { KEY_LAST_ACTIVE_DATE } from './engagement';
import { KEY_START_DATE } from './programDay';
import { getAllKeys, multiRemove } from './storage';

// Prefixes for per-day logs to clear. / 日次ログ削除対象の接頭辞。
const KEY_PREFIXES = ['todayLog:action:', 'morningLog:', 'nightLog:'];

export async function resetAllProgress(): Promise<void> {
  const keys = await getAllKeys();
  const target = keys.filter((key) => {
    if (key === KEY_START_DATE) return true;
    if (key === KEY_LAST_ACTIVE_DATE) return true;
    return KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
  });

  await multiRemove(target);
}

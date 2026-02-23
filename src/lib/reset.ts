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
import { entryStore } from '../storage/entryStore';
import { isSupabaseConfigured, supabase } from './supabase';

// Prefixes for per-day logs to clear. / 日次ログ削除対象の接頭辞。
const KEY_PREFIXES = ['todayLog:action:', 'morningLog:', 'nightLog:'];

export async function resetAllProgress(): Promise<void> {
  const keys = await getAllKeys();
  const target = keys.filter((key) => {
    if (key === KEY_START_DATE) return true;
    if (key === KEY_LAST_ACTIVE_DATE) return true;
    return KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
  });

  await Promise.all([multiRemove(target), entryStore.clearAll()]);

  // Best-effort remote purge when sync/account is enabled.
  if (!isSupabaseConfigured) return;
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return;
    const { error } = await supabase.from('entries').delete().eq('user_id', user.id);
    if (error) {
      console.warn('Failed to delete remote entries during reset.', error);
    }
  } catch (err) {
    console.warn('Failed to run remote reset cleanup.', err);
  }
}

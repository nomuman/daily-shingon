/**
 * Purpose: Track user return/engagement status. / 目的: ユーザーの復帰/エンゲージメント状態を管理。
 * Responsibilities: persist last active date and compute return gaps. / 役割: 最終アクティブ日を保存し復帰間隔を計算。
 * Inputs: optional date values. / 入力: 任意の日付。
 * Outputs: ReturnStatus with gap days and return flag. / 出力: gap日数と復帰フラグを含むReturnStatus。
 * Dependencies: date helpers and storage helpers. / 依存: 日付ヘルパー、ストレージヘルパー。
 * Side effects: reads/writes AsyncStorage. / 副作用: AsyncStorage読書き。
 * Edge cases: no last active date yields a neutral status. / 例外: 最終アクティブ日なしは中立状態。
 */
import { diffDays, parseISODateLocal, toISODateLocal } from './date';
import { getString, setString } from './storage';

export const KEY_LAST_ACTIVE_DATE = 'curriculum30:lastActiveDateISO';

export type ReturnStatus = {
  isReturn: boolean;
  gapDays: number;
  lastActiveISO: string | null;
};

export async function markActive(date = new Date()): Promise<void> {
  await setString(KEY_LAST_ACTIVE_DATE, toISODateLocal(date));
}

export async function getReturnStatus(today = new Date()): Promise<ReturnStatus> {
  const lastISO = await getString(KEY_LAST_ACTIVE_DATE);
  if (!lastISO) {
    return { isReturn: false, gapDays: 0, lastActiveISO: null };
  }

  const lastDate = parseISODateLocal(lastISO);
  const gap = Math.max(0, diffDays(today, lastDate));

  return {
    isReturn: gap >= 2,
    gapDays: gap,
    lastActiveISO: lastISO,
  };
}

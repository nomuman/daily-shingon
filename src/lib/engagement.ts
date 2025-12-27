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

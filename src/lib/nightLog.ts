/**
 * Purpose: Storage helpers for night reflection logs. / 目的: 夜の振り返りログの保存ヘルパー。
 * Responsibilities: read/write/clear daily night logs and compute completion. / 役割: 日次ログの読込/保存/削除と完了判定。
 * Inputs: date, selected choices, and optional note. / 入力: 日付、選択結果、任意メモ。
 * Outputs: persisted NightLog records. / 出力: 保存されたNightLog。
 * Dependencies: storage helpers, date utils, engagement tracking. / 依存: ストレージ、日付ユーティリティ、エンゲージメント。
 * Side effects: writes to AsyncStorage and updates engagement activity. / 副作用: AsyncStorage書込、アクティブ日更新。
 * Edge cases: legacy boolean-only logs are normalized without discarding them. / 例外: 旧式booleanログは破棄せず正規化。
 */
import { markActive } from './engagement';
import { toISODateLocal } from './date';
import { getJSON, removeItem, setJSON } from './storage';
import type { EntryEko, EntryPick } from '../storage/entryStore.types';

export type NightLog = {
  dateISO: string; // YYYY-MM-DD（ローカル日付）
  sangeDone: boolean; // 懺悔
  hotsuganDone: boolean; // 発願
  ekouDone: boolean; // 回向
  sange: EntryPick;
  hotsugan: EntryPick;
  ekou: EntryEko;
  note: string; // 任意メモ（短文）
  savedAtISO: string; // ISO datetime
};

type RawNightLog = Partial<NightLog> &
  Record<string, unknown> & {
    sangeDone?: boolean;
    hotsuganDone?: boolean;
    ekouDone?: boolean;
  };

// Storage key prefix per date. / 日付別のキー接頭辞。
const KEY_PREFIX = 'nightLog:'; // + YYYY-MM-DD

function keyFor(date = new Date()): string {
  return `${KEY_PREFIX}${toISODateLocal(date)}`;
}

function isEntryPick(value: unknown): value is EntryPick {
  return value === 'body' || value === 'speech' || value === 'mind' || value === null;
}

function isEntryEko(value: unknown): value is EntryEko {
  return (
    value === 'self' || value === 'family' || value === 'team' || value === 'all' || value === null
  );
}

function normalizeNightLog(value: RawNightLog | null): NightLog | null {
  if (!value || typeof value !== 'object') return null;
  if (typeof value.dateISO !== 'string' || typeof value.savedAtISO !== 'string') return null;

  const sange = isEntryPick(value.sange) ? value.sange : null;
  const hotsugan = isEntryPick(value.hotsugan) ? value.hotsugan : null;
  const ekou = isEntryEko(value.ekou) ? value.ekou : null;

  return {
    dateISO: value.dateISO,
    sangeDone: typeof value.sangeDone === 'boolean' ? value.sangeDone : !!sange,
    hotsuganDone: typeof value.hotsuganDone === 'boolean' ? value.hotsuganDone : !!hotsugan,
    ekouDone: typeof value.ekouDone === 'boolean' ? value.ekouDone : !!ekou,
    sange,
    hotsugan,
    ekou,
    note: typeof value.note === 'string' ? value.note : '',
    savedAtISO: value.savedAtISO,
  };
}

export function isNightComplete(log: NightLog | null): boolean {
  if (!log) return false;
  return log.sangeDone && log.hotsuganDone && log.ekouDone;
}

export async function getNightLog(date = new Date()): Promise<NightLog | null> {
  const raw = await getJSON<RawNightLog>(keyFor(date));
  return normalizeNightLog(raw);
}

export async function setNightLog(
  input: Pick<NightLog, 'sange' | 'hotsugan' | 'ekou' | 'note'> & { date?: Date },
): Promise<void> {
  const date = input.date ?? new Date();
  const payload: NightLog = {
    dateISO: toISODateLocal(date),
    sangeDone: !!input.sange,
    hotsuganDone: !!input.hotsugan,
    ekouDone: !!input.ekou,
    sange: input.sange ?? null,
    hotsugan: input.hotsugan ?? null,
    ekou: input.ekou ?? null,
    note: input.note ?? '',
    savedAtISO: new Date().toISOString(),
  };

  await setJSON(keyFor(date), payload);
  await markActive(date);
}

export async function clearNightLog(date = new Date()): Promise<void> {
  await removeItem(keyFor(date));
}

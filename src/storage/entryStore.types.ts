/**
 * Purpose: Local entry model and storage interface for sync. / 目的: 同期用のEntryモデルと保存IF。
 * Responsibilities: define Entry shape and repository contract. / 役割: Entry形状とRepository契約を定義。
 * Inputs: dates, slots, and entry payloads. / 入力: 日付・スロット・Entryデータ。
 * Outputs: typed contracts for storage implementations. / 出力: ストレージ実装の型。
 */
export type EntrySlot = 'morning' | 'night';
export type EntryPick = 'body' | 'speech' | 'mind' | null;
export type EntryEko = 'self' | 'family' | 'team' | 'all' | null;

export type Entry = {
  date: string; // YYYY-MM-DD (local date key)
  slot: EntrySlot;
  bodyDone: boolean;
  speechDone: boolean;
  mindDone: boolean;
  actionPick?: EntryPick;
  sange?: EntryPick;
  hatsugan?: EntryPick;
  eko?: EntryEko;
  noteCiphertext?: string | null;
  noteNonce?: string | null;
  noteVersion?: number | null;
  clientUpdatedAt: string; // ISO
  deletedAt?: string | null;
  isDirty: boolean;
  serverUpdatedAt?: string | null;
  deviceId?: string | null;
};

export interface EntryStore {
  upsertLocal(entry: Entry): Promise<void>;
  listByDate(date: string): Promise<Entry[]>;
  listDirty(): Promise<Entry[]>;
  applyRemote(entries: Array<Omit<Entry, 'isDirty'>>): Promise<void>;
  markClean(key: { date: string; slot: EntrySlot }, serverUpdatedAt: string): Promise<void>;
  getLastSyncAt(): Promise<string | null>;
  setLastSyncAt(value: string): Promise<void>;
}

/**
 * Purpose: Save entries locally and trigger sync. / 目的: ローカル保存と同期呼び出し。
 * Responsibilities: mark entries dirty and invoke sync when appropriate. / 役割: dirty付与と同期呼び出し。
 * Inputs: Entry payload from UI. / 入力: UIからのEntry。
 * Outputs: persisted local entry and optional sync. / 出力: ローカル保存と同期。
 */
import { entryStore } from '../../storage/entryStore';
import type { Entry, EntrySlot } from '../../storage/entryStore';
import { syncNow } from '../../sync/syncNow';

type EntryInput = Omit<Entry, 'clientUpdatedAt' | 'isDirty' | 'serverUpdatedAt'> & {
  serverUpdatedAt?: string | null;
};

export async function saveEntry(input: EntryInput) {
  const now = new Date().toISOString();

  await entryStore.upsertLocal({
    ...input,
    clientUpdatedAt: now,
    isDirty: true,
    noteVersion: input.noteVersion ?? 1,
  });

  // Prefer explicit sync triggers in UI (e.g., on blur or foreground). / 同期はUI側タイミング推奨。
  await syncNow();
}

export async function softDeleteEntry(date: string, slot: EntrySlot) {
  const now = new Date().toISOString();
  await entryStore.upsertLocal({
    date,
    slot,
    bodyDone: false,
    speechDone: false,
    mindDone: false,
    actionPick: null,
    sange: null,
    hatsugan: null,
    eko: null,
    noteCiphertext: null,
    noteNonce: null,
    noteVersion: 1,
    clientUpdatedAt: now,
    deletedAt: now,
    isDirty: true,
  });
  await syncNow();
}

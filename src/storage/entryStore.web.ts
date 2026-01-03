/**
 * Purpose: IndexedDB-backed EntryStore for web. / 目的: Web向けIndexedDB EntryStore。
 * Responsibilities: persist entries and sync metadata locally. / 役割: エントリと同期メタの永続化。
 * Inputs: Entry payloads, date keys, sync timestamps. / 入力: Entryデータ、日付キー、同期時刻。
 * Outputs: stored entries and metadata. / 出力: 保存済みEntryとメタ。
 * Dependencies: idb. / 依存: idb。
 */
import { openDB } from 'idb';

import type { Entry, EntryStore } from './entryStore.types';

let dbPromise: ReturnType<typeof openDB> | null = null;

function getDb() {
  if (typeof globalThis === 'undefined' || !('indexedDB' in globalThis)) {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB('dailyshingon-web', 1, {
      upgrade(db) {
        db.createObjectStore('entries', { keyPath: ['date', 'slot'] });
        db.createObjectStore('meta');
      },
    });
  }
  return dbPromise;
}

export const entryStore: EntryStore = {
  async upsertLocal(entry) {
    const db = await getDb();
    if (!db) return;
    await db.put('entries', entry);
  },

  async listByDate(date: string) {
    const db = await getDb();
    if (!db) return [];
    const all = (await db.getAll('entries')) as Entry[];
    return all
      .filter((entry) => entry.date === date && !entry.deletedAt)
      .sort((a, b) => (a.slot < b.slot ? -1 : 1));
  },

  async listDirty() {
    const db = await getDb();
    if (!db) return [];
    const all = (await db.getAll('entries')) as Entry[];
    return all.filter((entry) => entry.isDirty);
  },

  async applyRemote(entries) {
    const db = await getDb();
    if (!db) return;
    for (const entry of entries) {
      await db.put('entries', { ...entry, isDirty: false });
    }
  },

  async markClean(key, serverUpdatedAt) {
    const db = await getDb();
    if (!db) return;
    const entry = (await db.get('entries', [key.date, key.slot])) as Entry | undefined;
    if (!entry) return;
    await db.put('entries', { ...entry, isDirty: false, serverUpdatedAt });
  },

  async getLastSyncAt() {
    const db = await getDb();
    if (!db) return null;
    return (await db.get('meta', 'last_sync_at')) as string | null;
  },

  async setLastSyncAt(value) {
    const db = await getDb();
    if (!db) return;
    await db.put('meta', value, 'last_sync_at');
  },
};

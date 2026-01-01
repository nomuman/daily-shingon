/**
 * Purpose: SQLite-backed EntryStore for iOS/Android. / 目的: iOS/Android向けSQLite EntryStore。
 * Responsibilities: persist entries and sync metadata locally. / 役割: エントリと同期メタの永続化。
 * Inputs: Entry payloads, date keys, sync timestamps. / 入力: Entryデータ、日付キー、同期時刻。
 * Outputs: stored entries and metadata. / 出力: 保存済みEntryとメタ。
 * Dependencies: expo-sqlite. / 依存: expo-sqlite。
 */
import * as SQLite from 'expo-sqlite';

import type { Entry, EntrySlot, EntryStore } from './entryStore.types';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('dailyshingon.db');
    const db = await dbPromise;
    await db.execAsync(`
      create table if not exists entries (
        entry_date text not null,
        slot text not null,
        body_done integer not null,
        speech_done integer not null,
        mind_done integer not null,
        action_pick text,
        sange text,
        hatsugan text,
        eko text,
        note_ciphertext text,
        note_nonce text,
        note_version integer,
        client_updated_at text not null,
        deleted_at text,
        is_dirty integer not null,
        server_updated_at text,
        device_id text,
        primary key (entry_date, slot)
      );
      create table if not exists meta (
        key text primary key,
        value text
      );
    `);
  }
  return dbPromise;
}

const b2i = (value: boolean) => (value ? 1 : 0);
const i2b = (value: unknown) => Number(value) === 1;

function mapRow(row: any): Entry {
  return {
    date: row.entry_date,
    slot: row.slot as EntrySlot,
    bodyDone: i2b(row.body_done),
    speechDone: i2b(row.speech_done),
    mindDone: i2b(row.mind_done),
    actionPick: row.action_pick,
    sange: row.sange,
    hatsugan: row.hatsugan,
    eko: row.eko,
    noteCiphertext: row.note_ciphertext,
    noteNonce: row.note_nonce,
    noteVersion: row.note_version,
    clientUpdatedAt: row.client_updated_at,
    deletedAt: row.deleted_at,
    isDirty: i2b(row.is_dirty),
    serverUpdatedAt: row.server_updated_at,
    deviceId: row.device_id,
  };
}

export const entryStore: EntryStore = {
  async upsertLocal(entry) {
    const db = await getDb();
    await db.runAsync(
      `insert into entries (
        entry_date, slot, body_done, speech_done, mind_done, action_pick, sange, hatsugan, eko,
        note_ciphertext, note_nonce, note_version, client_updated_at, deleted_at, is_dirty,
        server_updated_at, device_id
      )
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      on conflict(entry_date, slot) do update set
        body_done=excluded.body_done,
        speech_done=excluded.speech_done,
        mind_done=excluded.mind_done,
        action_pick=excluded.action_pick,
        sange=excluded.sange,
        hatsugan=excluded.hatsugan,
        eko=excluded.eko,
        note_ciphertext=excluded.note_ciphertext,
        note_nonce=excluded.note_nonce,
        note_version=excluded.note_version,
        client_updated_at=excluded.client_updated_at,
        deleted_at=excluded.deleted_at,
        is_dirty=excluded.is_dirty,
        server_updated_at=excluded.server_updated_at,
        device_id=excluded.device_id`,
      [
        entry.date,
        entry.slot,
        b2i(entry.bodyDone),
        b2i(entry.speechDone),
        b2i(entry.mindDone),
        entry.actionPick ?? null,
        entry.sange ?? null,
        entry.hatsugan ?? null,
        entry.eko ?? null,
        entry.noteCiphertext ?? null,
        entry.noteNonce ?? null,
        entry.noteVersion ?? 1,
        entry.clientUpdatedAt,
        entry.deletedAt ?? null,
        b2i(entry.isDirty),
        entry.serverUpdatedAt ?? null,
        entry.deviceId ?? null,
      ],
    );
  },

  async listByDate(date: string) {
    const db = await getDb();
    const rows = await db.getAllAsync<any>(
      `select * from entries where entry_date=? and deleted_at is null order by slot asc`,
      [date],
    );
    return rows.map(mapRow);
  },

  async listDirty() {
    const db = await getDb();
    const rows = await db.getAllAsync<any>(`select * from entries where is_dirty=1`, []);
    return rows.map(mapRow).map((row) => ({ ...row, isDirty: true }));
  },

  async applyRemote(entries) {
    for (const entry of entries) {
      await this.upsertLocal({ ...entry, isDirty: false });
    }
  },

  async markClean(key, serverUpdatedAt) {
    const db = await getDb();
    await db.runAsync(
      `update entries set is_dirty=0, server_updated_at=? where entry_date=? and slot=?`,
      [serverUpdatedAt, key.date, key.slot],
    );
  },

  async getLastSyncAt() {
    const db = await getDb();
    const row = await db.getFirstAsync<any>(
      `select value from meta where key='last_sync_at'`,
      [],
    );
    return row?.value ?? null;
  },

  async setLastSyncAt(value) {
    const db = await getDb();
    await db.runAsync(
      `insert into meta(key, value) values('last_sync_at', ?)
       on conflict(key) do update set value=excluded.value`,
      [value],
    );
  },
};

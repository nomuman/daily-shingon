/**
 * Purpose: Minimal push/pull sync for entries. / 目的: entriesの最小Push/Pull同期。
 * Responsibilities: upsert dirty entries, pull updates since last sync. / 役割: dirty送信と差分取得。
 * Inputs: local store state and Supabase session. / 入力: ローカル状態とセッション。
 * Outputs: local store updated with server state. / 出力: ローカル更新。
 * Dependencies: Supabase client, EntryStore. / 依存: Supabase, EntryStore。
 */
import { supabase } from '../lib/supabase';
import { entryStore } from '../storage/entryStore';
import type { Entry } from '../storage/entryStore';

function toServerRow(entry: Entry) {
  return {
    entry_date: entry.date,
    slot: entry.slot,
    body_done: entry.bodyDone,
    speech_done: entry.speechDone,
    mind_done: entry.mindDone,
    action_pick: entry.actionPick ?? null,
    sange: entry.sange ?? null,
    hatsugan: entry.hatsugan ?? null,
    eko: entry.eko ?? null,
    note_ciphertext: entry.noteCiphertext ?? null,
    note_nonce: entry.noteNonce ?? null,
    note_version: entry.noteVersion ?? 1,
    client_updated_at: entry.clientUpdatedAt,
    deleted_at: entry.deletedAt ?? null,
    device_id: entry.deviceId ?? null,
  };
}

function fromServerRow(row: any): Omit<Entry, 'isDirty'> {
  return {
    date: row.entry_date,
    slot: row.slot,
    bodyDone: row.body_done,
    speechDone: row.speech_done,
    mindDone: row.mind_done,
    actionPick: row.action_pick,
    sange: row.sange,
    hatsugan: row.hatsugan,
    eko: row.eko,
    noteCiphertext: row.note_ciphertext,
    noteNonce: row.note_nonce,
    noteVersion: row.note_version,
    clientUpdatedAt: row.client_updated_at,
    deletedAt: row.deleted_at,
    serverUpdatedAt: row.server_updated_at,
    deviceId: row.device_id,
  };
}

export async function syncNow() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) return;

  // --- PUSH ---
  const dirty = await entryStore.listDirty();
  if (dirty.length > 0) {
    const payload = dirty.map((entry) => ({ ...toServerRow(entry), user_id: user.id }));

    const { data, error } = await supabase
      .from('entries')
      .upsert(payload, { onConflict: 'user_id,entry_date,slot' })
      .select('entry_date,slot,server_updated_at');

    if (error) throw error;

    for (const row of data ?? []) {
      await entryStore.markClean(
        { date: row.entry_date, slot: row.slot },
        row.server_updated_at,
      );
    }
  }

  // --- PULL ---
  const last = await entryStore.getLastSyncAt();
  let query = supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .order('server_updated_at', { ascending: true })
    .limit(500);

  if (last) query = query.gt('server_updated_at', last);

  const { data: remote, error: pullError } = await query;
  if (pullError) throw pullError;

  if (remote && remote.length > 0) {
    const mapped = remote.map(fromServerRow);
    await entryStore.applyRemote(mapped);

    const maxServerUpdatedAt = remote[remote.length - 1].server_updated_at as string;
    await entryStore.setLastSyncAt(maxServerUpdatedAt);
  }
}

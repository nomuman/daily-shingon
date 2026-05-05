/**
 * Purpose: Delete the current user's account permanently. / 目的: 現在のユーザーのアカウントを完全に削除する。
 * Responsibilities: Call the delete-user Edge Function, clear local data, and sign out. / 役割: delete-user Edge Functionを呼び出し、ローカルデータを消去してサインアウトする。
 * Inputs: none (uses current session). / 入力: なし（現在のセッションを使用）。
 * Outputs: void or throws. / 出力: void、または例外。
 * Dependencies: supabase client, resetAllProgress. / 依存: Supabaseクライアント、resetAllProgress。
 */
import { supabase } from '../supabase';
import { resetAllProgress } from '../reset';

const envSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';

export async function deleteAccount(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const functionsUrl = `${envSupabaseUrl}/functions/v1/delete-user`;

  const response = await fetch(functionsUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Delete failed (${response.status})`);
  }

  // Clear all local data and sign out.
  await resetAllProgress();
  await supabase.auth.signOut();
}

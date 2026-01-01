/**
 * Purpose: Email magic link sign-in helpers for Supabase. / 目的: Supabaseのメールリンクサインイン。
 * Responsibilities: trigger magic link email and exchange PKCE code on callback. / 役割: メール送信とPKCEコード交換。
 * Inputs: email and callback URL. / 入力: メールアドレスとコールバックURL。
 * Outputs: session or errors. / 出力: セッションまたはエラー。
 * Dependencies: expo-linking, Supabase client. / 依存: Linking, Supabase。
 */
import * as LinkingExpo from 'expo-linking';

import { supabase } from '../lib/supabase';

export async function signInWithEmail(email: string) {
  const redirectTo = LinkingExpo.createURL('auth/callback');

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw error;
}

export async function handleAuthCallbackUrl(url: string) {
  const parsed = LinkingExpo.parse(url);
  const code = (parsed.queryParams?.code as string | undefined) ?? undefined;
  if (!code) return;

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;
}

/**
 * Purpose: Email/password auth helpers for Supabase. / 目的: Supabaseのメール+パスワード認証ヘルパー。
 * Responsibilities: sign-in/sign-up with password and optional callback handling. / 役割: パスワード認証と任意のコールバック処理。
 * Inputs: email, password, optional callback URL. / 入力: メールアドレス、パスワード、コールバックURL。
 * Outputs: session or errors. / 出力: セッションまたはエラー。
 * Dependencies: expo-linking, Supabase client. / 依存: Linking, Supabase。
 */
import * as LinkingExpo from 'expo-linking';

import { supabase } from '../lib/supabase';

export async function signInWithEmailPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

export async function signUpWithEmailPassword(email: string, password: string) {
  const redirectTo = LinkingExpo.createURL('auth/callback');
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw error;
}

export async function handleAuthCallbackUrl(url: string) {
  const parsed = LinkingExpo.parse(url);
  const code = (parsed.queryParams?.code as string | undefined) ?? undefined;
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return;
  }

  const fragment = url.includes('#') ? url.split('#')[1] : '';
  const fragmentParams = fragment
    .split('&')
    .map((pair) => pair.split('='))
    .reduce<Record<string, string>>((acc, [k, v]) => {
      if (!k) return acc;
      acc[decodeURIComponent(k)] = decodeURIComponent(v ?? '');
      return acc;
    }, {});

  const accessToken =
    (parsed.queryParams?.access_token as string | undefined) ?? fragmentParams.access_token;
  const refreshToken =
    (parsed.queryParams?.refresh_token as string | undefined) ?? fragmentParams.refresh_token;

  if (!accessToken || !refreshToken) return;

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) throw error;
}

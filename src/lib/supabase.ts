/**
 * Purpose: Supabase client initialization for Expo (iOS/Android/Web). / 目的: Expo向けSupabaseクライアント初期化。
 * Responsibilities: configure auth storage, PKCE flow, and token refresh. / 役割: 認証ストレージ、PKCE、トークン更新を設定。
 * Inputs: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY. / 入力: Supabase公開URLとキー。
 * Outputs: shared Supabase client instance. / 出力: 共有Supabaseクライアント。
 * Dependencies: supabase-js, AsyncStorage, React Native AppState. / 依存: supabase-js, AsyncStorage, AppState。
 * Side effects: registers AppState listener for auto-refresh. / 副作用: AppStateで自動更新の開始/停止。
 */
import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
    flowType: 'pkce',
  },
});

// non-web: refresh tokens only while foregrounded. / 非Webはフォアグラウンド中のみ更新。
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

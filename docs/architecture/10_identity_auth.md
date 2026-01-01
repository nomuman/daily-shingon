# Identity / Auth 設計（Supabase）

## 採用: Supabase Auth

- 認証方式: email + OTP / magic link / ソーシャル等（将来選べる）
- Client SDK: supabase-js（v2 系を想定）
- Expo/モバイル: PKCE flow を前提（推奨フロー）  
  :contentReference[oaicite:14]{index=14}

## ユーザーIDの扱い

- 主キー: `auth.users.id`（UUID）
- アプリ側の user_id はこの UUID を使い続ける（変更しない）
- `public.profiles.user_id` は `auth.users.id` を参照

## セッション管理（ざっくり）

- Refresh token を安全に保持（SecureStore推奨）
- Access token は短命前提で、自動更新に任せる
- “ログアウト” は端末ローカル（SQLite/キーチェーン）も初期化できる導線を用意する

## Web / Native 差分（重要）

- Web（SPA）: リダイレクトで返る `code` を `exchangeCodeForSession` で交換（PKCE） :contentReference[oaicite:9]{index=9}
- OAuthの `redirectTo` は Allow List へ登録が必要 :contentReference[oaicite:10]{index=10}
- React Native: localStorage が無いので、RN向けストレージ設定が必須（未設定だとlocalStorageエラーになりがち） :contentReference[oaicite:11]{index=11}

## マルチデバイス識別

- device_id（UUID）を端末生成して保持
- `public.devices` に登録（push token/last_seen）
- 同期の “変更の発生源” として device_id を entries に記録

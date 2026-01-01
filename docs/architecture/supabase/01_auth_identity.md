# 認証/ID設計（Supabase Auth）

## 方針
- Supabase Auth を唯一のIDプロバイダにする
- クライアントは publishable/anon key を使用（RLS前提）
- セッション永続化は環境ごとに適切なstorageを使う

## 対応ログイン
- Email + Password（MVP）
- OAuth（Google / Apple）※モバイルは Deep Link + PKCE を基本

## OAuth（PKCE）前提
- モバイルはブラウザで認可 → アプリに Deep Link 戻し
- 戻りURLに `?code=...` が付与される（PKCE）
- `exchangeCodeForSession(code)` でセッション化する

## Redirect URLs（重要）
Supabase Dashboard: Authentication > URL Configuration に登録
- Web: `https://<your-domain>/auth/callback`
- Local dev: `http://localhost:19006/auth/callback`（環境に応じて）
- Mobile deep link: `dailyshingon://auth/callback`

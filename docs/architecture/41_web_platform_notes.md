# Web対応メモ（iOS / Android / Web 共通設計の“差分”）

このアーキテクチャは iOS/Android/Web を同一のバックエンド（Supabase Auth + Postgres + RLS）で成立させる。
差分が出るのは主に「ローカル永続化」「認証リダイレクト/セッション保存」「通知」。

## 1. ローカル永続化（Offline-first）のWeb差分

### 結論

- **Mobile（iOS/Android）:** `expo-sqlite` を第一候補
- **Web:** `expo-sqlite` は **Web support が alpha** で、WASM と `SharedArrayBuffer` 設定が必要。安定性要件が高い場合は **IndexedDB** か **SQLite WASM（OPFS）** を検討する。 :contentReference[oaicite:0]{index=0}

### Webで expo-sqlite を使う場合の要点

- Expo公式: Web support は alpha（不安定な可能性あり）
- Web用には Metro の wasm 対応設定が必要
- `SharedArrayBuffer` を使うために HTTP header（cross-origin isolation）が必要 :contentReference[oaicite:1]{index=1}

### 代替案（推奨度順）

A) IndexedDB（最も現実的）

- 実装は増えるが、Webの互換性が高い
- Sync Engine はそのまま、LocalStore 実装だけ差し替える

B) SQLite WASM + OPFS（高速・ただしブラウザ要件）

- Chrome などの OPFS（Origin Private File System）で永続化できる選択肢がある :contentReference[oaicite:2]{index=2}
- ただしブラウザ差・ヘッダ要件・Worker構成など、実装/運用コストが上がる

## 2. Auth（PKCE）とリダイレクトのWeb差分

### 共通の前提（iOS/Android/Web）

- Supabase Auth は **PKCE flow** が標準的（モバイル/SPAでも基本はPKCE） :contentReference[oaicite:3]{index=3}

### Web（SPA）の基本

- OAuthログインでは `redirectTo` を指定し、**Redirect Allow List** に登録する必要がある :contentReference[oaicite:4]{index=4}
- リダイレクトで `code` が返り、`exchangeCodeForSession` でセッションに交換する（PKCE） :contentReference[oaicite:5]{index=5}

### よくある落とし穴（運用）

- 許可済みURL/環境変数の不整合で localhost に飛ぶ等が起こりうるため、環境（dev/stg/prd）ごとの Allow List を明確に分ける :contentReference[oaicite:6]{index=6}

## 3. セッション保存（Storage）のWeb差分

- Web: localStorage などブラウザ標準ストレージを使える
- React Native: localStorage が無いので、Supabase側のガイドに従い RN用のストレージを指定する（指定しないと localStorage エラーになりがち） :contentReference[oaicite:7]{index=7}

## 4. 通知のWeb差分

- iOS/Android: Expo Notifications でローカル通知 →（必要なら）リモート通知へ拡張
- Web: Service Worker と通知権限の設計が別物で、初期コストが高い
  - MVPでは **Webは通知なし** でも設計破綻しないよう、`NotificationProvider` を差し替え可能にする

## 5. 推奨インターフェース分離（重要）

共通ロジック（同期/ドメイン）からプラットフォーム差分を隔離する。

- `LocalStore`
  - mobile: SQLite
  - web: IndexedDB（or SQLite wasm）
- `AuthSessionStore`
  - mobile: SecureStore/AsyncStorage（方針に沿って）
  - web: localStorage
- `NotificationProvider`
  - mobile: expo-notifications
  - web: no-op（MVP）/web-push（将来）

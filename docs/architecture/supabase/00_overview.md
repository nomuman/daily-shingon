# Supabase対応 全体設計（iOS / Android / Web）

## ゴール
- 既存MVP（端末内保存: Entry/Settings）を維持しつつ、マルチデバイス同期を追加する
- ID管理は Supabase Auth、ユーザーデータは Postgres（RLS必須）で保持する

## アーキテクチャ（Local-first + Sync）
- Client（Expo: iOS/Android/Web）
  - ローカルDB（native: SQLite / web: IndexedDB）
  - 同期エンジン（push/pull）
- Supabase
  - Auth（メール/ソーシャル）
  - Postgres（profiles, entries, user_settings ほか）
  - Realtime（将来、任意）

## 正(SoT)の定義
- 日々の入力体験の正: ローカルDB（即反映）
- マルチデバイス整合の正: サーバー（同期で収束）

## 最小ユースケース
- サインイン
- 今日の朝/夜ログを記録
- 別端末でログが見える（pull）

# 三密アプリ（Supabase + Postgres）アーキテクチャ概要

このドキュメントは、三密アプリを「マルチデバイス対応」するために、
Supabase（Auth）と Postgres（ユーザーデータ）を採用した設計をまとめる。

## 北極星（変えない）

- 毎日5分未満で「学び→実践→整え」が回る（短い・迷わない）
- 連続より復帰が偉い（責めない）
- 宗教の代替ではなく “日常実践の補助輪”（境界線を守る）
- プライバシー最優先（ログは原則ローカル、同期はオプション）

根拠: コンセプト / UX/IA / データモデル / コンテンツ方針  
:contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6} :contentReference[oaicite:7]{index=7}

## 何をSupabaseに載せるか（結論）

- ID管理: Supabase Auth（メール/OTP/ソーシャル等）
- 同期するユーザーデータ: Postgres（entries/settings/bookmarks/progress/devices）
- コンテンツ（学びカード/用語集）: アプリ同梱 + アップデートで配布（DBに置かない）
  - DBに置くのは「ユーザーの進捗・保存・ログ」だけ

Supabase Auth/PKCE/RLS/Realtime/Edge Functions は公式仕様に準拠する。  
:contentReference[oaicite:8]{index=8}

## システム図（テキスト）

Client(Expo)

- SQLite(Local) が正
- Sync Engine が差分を Supabase に Push/Pull
- 認証は Supabase Auth（PKCE）
- RLSで user_id を強制

## プラットフォーム差分（iOS/Android/Web）

- Webは主に「ローカル永続化（expo-sqlite web alpha問題）」と 「Authリダイレクト/セッション保存」の取り扱いが違う。詳細: docs/architecture/41_web_platform_notes.md

## Supabase

- Auth: ユーザーID・セッション
- Postgres: entries/settings/bookmarks/progress/devices
- Realtime: entries の変更通知（任意）
- Edge Functions: レシート検証/プッシュ送信/運用タスク（任意）

## まず守るセキュリティ原則

- すべてのユーザーデータ行に user_id を持たせる
- すべてのテーブルで RLS を有効化
- policy は `auth.uid()` + 「認証済みチェック」を明示する（未認証は null になる）  
  :contentReference[oaicite:9]{index=9}

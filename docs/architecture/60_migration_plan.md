# docs/architecture/60_migration_plan.md

# 移行計画（AsyncStorage → SQLite → Supabase同期）

現状MVPは端末内保存（AsyncStorage想定）。ここを壊さず同期へ伸ばす。  
:contentReference[oaicite:25]{index=25}

## Phase 0: 破壊しない下準備

- storageアクセスを “1箇所” に寄せる（lib/storage）
- Entry/UserSettingsの型を固定（マイグレーション関数を用意）

## Phase 1: SQLite化（おすすめ）

- AsyncStorageはJSON破損や速度でつらい局面が来る
- entries を日付キーで持つ設計は維持しつつ、SQLiteに移す
- ここまでで “オフライン品質” が上がる

## Phase 2: Supabase Auth 導入（同期はまだ）

- ログイン/ログアウトのUI導線
- profiles/user_settings/devices を作る
- まだ entries は送らない（心理的ハードルを避ける）

## Phase 3: 同期ON/OFFリリース

- Settingsに「同期を有効化」トグル
- 有効化したら:
  - last_sync_at を保持
  - 差分Push/Pull開始
- note は E2EE で送る（実装コストは上がるが、信頼が落ちにくい）

## Phase 4: Realtime/Edge Functions（必要なら）

- “複数端末を同時に使う” ユーザーが増えたら Realtime
- 課金を始めるなら Edge Functions + webhook

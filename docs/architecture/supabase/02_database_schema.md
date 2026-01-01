# DBスキーマ（Postgres）

## 目的
- 既存MVPのデータモデルを “できるだけそのまま” サーバーに写像する
- 同期のために `client_updated_at` / `server_updated_at` / `deleted_at` を持つ

## テーブル
### profiles（ユーザー設定）
- user_id (PK, auth.users参照)
- display_name（将来）
- created_at, updated_at

### devices（端末）
- id (PK)
- user_id（所有者）
- platform / model / push_token / last_seen_at

### user_settings（通知・同期設定）
- user_id (PK)
- reminder_morning_time / reminder_night_time / reminder_enabled
- tone / sync_enabled
- updated_at / settings_version

### entries（実践ログ）
- user_id（所有者）
- device_id（発生端末）
- entry_date（YYYY-MM-DDをdate型で）
- slot（morning/night）
- body_done / speech_done / mind_done
- action_pick / sange / hatsugan / eko（将来）
- note_ciphertext / note_nonce / note_version（E2EE用）
- client_updated_at（競合解決の軸）
- server_updated_at（差分同期の軸）
- deleted_at（論理削除）

### bookmarks / progress
- user_id と card_id の組で保存

## 制約 / インデックス
- unique(user_id, entry_date, slot)
- entries_user_day_idx（user_id, entry_date）
- entries_user_server_updated_at_idx（差分pullのため）

# 移行計画（AsyncStorage → LocalDB → Supabase Sync）

## Phase 0（現状）
- AsyncStorage に Entry/Settings

## Phase 1（ローカルDB導入）
- 起動時に AsyncStorage からLocalDBへ移行
- 以後はLocalDBのみ参照
- AsyncStorageは一定期間残し、検証後に削除

## Phase 2（Supabase同期）
- サインイン導入
- Sync Engine（push/pull）
- 失敗してもローカルは壊れない（Local-firstのメリット）

## Phase 3（仕上げ）
- Realtime（任意）
- E2EE（任意：note_ciphertext）

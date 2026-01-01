# 同期設計（Local-first）

## 同期単位
- entity: entries, user_settings
- 最小実装: entriesのみ同期（settingsは後回しでもOK）

## 同期の状態
ローカルに以下を持つ：
- is_dirty（未送信の変更がある）
- last_sync_at（前回pullしたサーバー時刻）

## Push（ローカル → サーバー）
- is_dirty の entries をまとめて upsert
- conflict key: (user_id, entry_date, slot)
- サーバーの返却(server_updated_at)でローカルを確定し、is_dirty=false

## Pull（サーバー → ローカル）
- `server_updated_at > last_sync_at` を取得
- ローカルへ upsert（deleted_at があればローカルからは非表示/削除）
- last_sync_at を更新（取得した最大server_updated_at が安全）

## 競合解決（最小）
- Last Write Wins（LWW）
  - 軸: client_updated_at（クライアントが更新した時刻）
  - pull側で “サーバーのclient_updated_atが新しいならサーバー勝ち” にする

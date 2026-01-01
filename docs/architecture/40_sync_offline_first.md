# 同期設計（オフラインファースト / 衝突解決）

## 原則

- ローカル（SQLite）が正。クラウドは “同期のためのコピー”
- 同期は Settings で明示的に ON にした人だけ
- 同期ONでも、note（自由記述）は暗号化して送る（E2EE）

この原則は「プライバシー最優先」「短い・迷わない」と整合させる。  
:contentReference[oaicite:18]{index=18} :contentReference[oaicite:19]{index=19} :contentReference[oaicite:20]{index=20}

## 同期方式（差分 Push/Pull）

### ローカル側

- 各レコードに `client_updated_at`（端末時刻）と `dirty` フラグ
- 送信成功で dirty=false
- 削除は tombstone（deleted_at）で表現して同期する

### サーバー側

- entries は (user_id, date, slot) unique
- server_updated_at を更新
- 取得は “since” で差分取得（server_updated_at > last_sync_at）

## 衝突解決（安全側）

1. done系（body_done/speech_done/mind_done）

- ORマージ（片方が true なら true）
- 理由: “できた” が消えるのが最悪。体験を壊す

2. pick系（action_pick/sange/hatsugan/eko）

- server_updated_at が新しい方を採用（LWW）
- 理由: 選択は1つでいい。迷わせない

3. note（暗号文）

- server_updated_at が新しい暗号文を採用（LWW）
- 理由: サーバーでマージ不能（暗号化のため）

## Realtime（任意）

- 端末Aが更新したら端末Bがすぐ反映、のUX改善に使える
- ただし復帰時/起動時は必ず Pull で最終整合を取る
- Realtimeは Postgres Changes（publicationに登録）  
  :contentReference[oaicite:21]{index=21}

## 同期の“心理的安全”

- 同期ONの説明文は短く、脅さず、選べるように
- 「ログは端末内が基本。同期は任意。noteは暗号化できる」を明示
  （コピーはトーンガイド準拠）  
  :contentReference[oaicite:22]{index=22}

## 同期方式（差分 Push/Pull）

### ローカル側

- 各レコードに `client_updated_at`（端末時刻）と `dirty` フラグ

## Webのローカル永続化について

- expo-sqlite は Web support が alpha で、WASM/SharedArrayBuffer のための追加設定が必要 :contentReference[oaicite:12]{index=12}
- 安定性優先なら LocalStore の Web 実装は IndexedDB に差し替える（同期設計は不変）
- 高速化を狙う場合は SQLite WASM + OPFS を検討（要件・実装コスト注意） :contentReference[oaicite:13]{index=13}

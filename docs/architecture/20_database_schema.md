# Postgres データ設計（同期用・最小）

MVPデータモデル（Entry/LearnCard/UserSettings）を “同期できる形” に再構成する。  
:contentReference[oaicite:15]{index=15}

## テーブル一覧（public）

- profiles: ユーザーの最小プロフィール（表示名など将来）
- devices: 端末一覧（push token / 最終同期）
- user_settings: 通知時刻/トーン/同期ON/OFF
- entries: 朝/夜の実践ログ（構造化データ + noteは暗号化）
- bookmarks: 学びカード保存
- progress: dayN の完了/既読（※“連続”ではなく、単なる記録）

## entries のキー設計

- 1日あたり最大2件（morning/night）
- `unique (user_id, entry_date, slot)` を採用
- id は UUID（レプリケーションや参照が楽）

## note の扱い（E2EE）

- note_ciphertext: base64/text（暗号文）
- note_nonce: base64/text（nonce）
- note_version: int（将来の暗号方式更新用）
- サーバーは復号できない前提（検索しない）

※ note を “任意” にして、使わない人はそもそも送らない。

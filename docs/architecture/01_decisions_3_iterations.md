# 設計を3回やり直したログ（意思決定）

## Iteration 1: “全部クラウド同期” 案（却下）

### 案

- entries（朝/夜ログ）も含めて全データを常にPostgresへ
- Realtimeで即同期

### 失敗ポイント

- そもそもこのアプリは「プライバシー最優先・端末内優先」が原則  
  :contentReference[oaicite:10]{index=10} :contentReference[oaicite:11]{index=11}
- ユーザーが “宗教/内省ログ” をクラウドに置くことに心理的抵抗が出やすい
- オフラインで完結する価値が崩れる（地下鉄・機内・寺など）

=> 結論: **“同期はオプション”** に設計変更。

---

## Iteration 2: “同期はON/OFF、でもデータは平文” 案（保留）

### 案

- 同期ONの人は Postgres に entries.note も含めて保存（平文）
- RLSで守る

### 問題

- RLSは強いが、運用/事故/権限ミスを「ゼロ」にはできない
- note は自由記述でセンシティブ化しやすい（家族/体調/悩み等）

=> 結論: **自由記述だけは E2EE（クライアント暗号化）を採用**。
構造化された選択データ（身口意のチェック等）は平文でOK（分析や復旧が効く）。

---

## Iteration 3: 最終案（採用）

### 最終結論

1. ローカルDB（SQLite）を正とする（オフラインファースト）
2. 同期ONの人だけ、選択ログと設定をPostgresへ同期
3. 自由記述 note はクライアント暗号化（E2EE）して保存（検索不可でOK）
4. 衝突解決は “ロジックで安全側に寄せる”
   - done系: ORマージ（どっちかが完了なら完了）
   - pick系: updated_at が新しい方
   - note: updated_at が新しい暗号文で上書き
5. Supabase Auth は Expo では PKCE を前提（安全にトークン取得）  
   :contentReference[oaicite:12]{index=12}
6. すべてRLSで user_id 強制。`auth.uid()` が未認証で null になる点を明示してpolicyを書く  
   :contentReference[oaicite:13]{index=13}

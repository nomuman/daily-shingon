# セキュリティ/プライバシー

## 必須
- RLS ON（profiles, entries, user_settings, devices, bookmarks, progress）
- クライアントは publishable/anon keyのみ使用（service_roleはサーバー専用）
- Redirect URL allow list を正しく設定

## 推奨
- note等の自由記述は E2EE を検討（ciphertextのみサーバー保存）
- ログ/分析に個人情報を入れない

# Edge Functions（任意だが強い）

Supabase Edge Functions は Deno/TypeScript のサーバー関数。Stripe連携などにも使える。  
:contentReference[oaicite:23]{index=23}

## このアプリでの使い道（優先順）

1. 課金（将来）

- RevenueCat/Stripe/AppStore/Play の webhook を受けて entitlement をDBに反映
- クライアント改ざん耐性を上げる

2. Push通知（将来）

- Expo Push Token を devices に保存し、
  サーバー主導で “朝/夜のやさしい通知” を送る（ユーザー設定に従う）
- ただし最初は端末ローカル通知（expo-notifications）で十分

3. 運用ツール

- 監修コンテンツの配信、利用規約改定の周知、エラー収集の集約（必要なら）

## 禁止/注意

- 宗教的効果の断定や、診断・鑑定に寄る処理はしない  
  :contentReference[oaicite:24]{index=24}

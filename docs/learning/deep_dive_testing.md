# Deep Dive: テスト（Jest / React Native Testing Library）

## 1) ExpoのJest（公式ガイド）

- jest-expo を使って unit / snapshot を書ける

## 2) RNTL（React Native Testing Library）

- “ユーザーの使い方に近いテストほど信頼できる”
- RN公式のTesting Overviewも参照

## 3) どこをテストする？

優先度順：

1. libの純粋ロジック（保存キー生成、日付処理、フィルタ関数）
2. 画面の “表示条件” と “押下で状態が変わる” ところ
3. ネイティブ依存（AppState/Localization/WebBrowser）はモック中心

## 4) 最初の課題（おすすめ）

- `getCardPacks(lang)` が ja/en で正しく件数を返す
- `normalizeContentLang()` が `en-US` を `en` に正規化できる
- Glossary検索で `q` を変えると表示が変わる（RNTLで）

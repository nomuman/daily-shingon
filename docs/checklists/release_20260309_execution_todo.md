# 3/9リリース実行TODO（コードベース基準）

最終更新: 2026-02-28

## 1. リリース設定・ビルド

- [x] `app.json` に iOS `buildNumber` を追加
- [x] `app.json` に Android `versionCode` を追加
- [x] OTA運用ポリシーを決定（1.0は `runtimeVersion` 未設定で運用）
- [x] EAS環境変数注入手順をドキュメント化（Secrets運用）
- [ ] `eas build` preview/production 実行確認（Android preview/production は完了。iOS は資格情報設定が必要）

## 2. 依存関係・ツールチェーン

- [x] `expo-doctor` の依存不整合を解消
- [x] `npm audit` の脆弱性を解消または許容判断を記録
- [x] CI Nodeとの差分をなくす（Node 20.19.4 前提）

## 3. 品質保証（QA）

- [x] 主要スモークテスト項目を実行・記録（自動項目は `docs/checklists/release_smoke_20260309.md` に記録済み）
- [ ] 通知挙動（許可拒否/再許可含む）を実機確認
- [ ] 認証/同期フローをE2E確認
- [x] CIに `typecheck` / `expo-doctor` / `expo export` を追加

## 4. コンテンツ品質（過不足・誤り）

- [x] 英語カード `texts.safe_quote_policy` の `sources` 欠落修正
- [x] 学び画面の出典表示をURL追跡可能なUIに改善
- [x] カード詳細/用語詳細の出典URLをタップ可能にする
- [x] コンテンツ整合性テスト（sources必須/参照整合）を追加
- [x] 参考URLリンクチェック結果を反映（`docs/checklists/reference_link_check_20260309.md`、1件 503）

## 5. 文言・法務ドキュメント

- [x] Google Play 日本語説明の同期文言矛盾を修正
- [x] 英語プライバシーページのHTML崩れを修正
- [x] サポート窓口情報を最終化
- [x] 法務文書の最終更新日を更新（2026-02-28）

## 6. UX・デザイン・リファクタリング

- [x] ルーティング設計（Tabs/Stack）方針の不整合を解消
- [x] Updates（ロードマップ）を初回公開向けに調整
- [x] 未使用コンポーネント/コードを整理
- [ ] 実機で最終ブラッシュアップ項目を反映

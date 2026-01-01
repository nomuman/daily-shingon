# src/ 全体地図（MECE・ファイル単位）

目的: `src/` 配下の責務を重ならない粒度で俯瞰するためのマップ（ファイル単位）。

## 1. 画面・ルーティング（Expo Router）

- `src/app/_layout.tsx`: アプリ全体レイアウト
- `src/app/+not-found.tsx`: 404
- `src/app/(tabs)/_layout.tsx`: タブ全体レイアウト
- `src/app/(tabs)/index.tsx`: ホーム
- `src/app/(tabs)/morning.tsx`: 朝の記録
- `src/app/(tabs)/night.tsx`: 夜の記録
- `src/app/(tabs)/settings.tsx`: 設定
- `src/app/(tabs)/learn/_layout.tsx`: 学習領域レイアウト
- `src/app/(tabs)/learn/index.tsx`: 学習トップ
- `src/app/(tabs)/learn/cards/index.tsx`: カード一覧
- `src/app/(tabs)/learn/cards/[packId].tsx`: パック詳細
- `src/app/(tabs)/learn/cards/[packId]/[cardId].tsx`: カード詳細
- `src/app/(tabs)/learn/glossary/index.tsx`: 用語集一覧
- `src/app/(tabs)/learn/glossary/[termId].tsx`: 用語詳細
- `src/app/day/[date].tsx`: 日付別詳細
- `src/app/history.tsx`: 履歴
- `src/app/updates.tsx`: 更新履歴
- `src/app/licenses.tsx`: OSS ライセンス
- `src/app/auth/callback.tsx`: 認証コールバック

## 2. UI レイヤ（再利用部品 / デザイン基盤 / アセット）

- `src/components/AppIcon.tsx`: アプリアイコン表示
- `src/components/BackButton.tsx`: 戻るボタン
- `src/components/ErrorState.tsx`: エラー表示
- `src/components/LearnCard.tsx`: 学習カード UI
- `src/components/SearchInput.tsx`: 検索入力
- `src/components/TagRow.tsx`: タグ表示
- `src/ui/theme.tsx`: テーマトークン
- `src/ui/responsive.tsx`: レスポンシブ補助
- `src/assets/icons/icon-arrow-forward.svg`: アイコン
- `src/assets/icons/icon-arrow-ne.svg`: アイコン
- `src/assets/icons/icon-check.svg`: アイコン
- `src/assets/icons/icon-home.svg`: アイコン
- `src/assets/icons/icon-learn.svg`: アイコン
- `src/assets/icons/icon-memo.svg`: アイコン
- `src/assets/icons/icon-morning.svg`: アイコン
- `src/assets/icons/icon-night.svg`: アイコン
- `src/assets/icons/icon-settings.svg`: アイコン
- `src/assets/icons/icon-uncheck.svg`: アイコン

## 3. ドメイン機能（ユースケース単位）

- `src/features/entries/saveEntry.ts`: 記録の保存

## 4. データ・コンテンツ層（教材 / 文言 / 型）

- `src/content/cards.ts`: カード定義
- `src/content/curriculum30.ts`: カリキュラム基盤
- `src/content/curriculum30.en.ts`: 英語カリキュラム
- `src/content/curriculum30.ja.ts`: 日本語カリキュラム
- `src/content/glossary.ts`: 用語集データ
- `src/content/lang.ts`: コンテンツ言語定義
- `src/content/oss-licenses.ts`: OSS ライセンスデータ
- `src/content/updates.ts`: 更新履歴データ
- `src/content/types.ts`: コンテンツ型
- `src/content/useContentLang.ts`: コンテンツ言語フック
- `src/locales/en/common.json`: 英語 UI 文言
- `src/locales/ja/common.json`: 日本語 UI 文言

## 5. 永続化・同期・認証

- `src/storage/entryStore.ts`: ストア共通定義
- `src/storage/entryStore.types.ts`: ストア型
- `src/storage/entryStore.native.ts`: ネイティブ実装
- `src/storage/entryStore.web.ts`: Web 実装
- `src/sync/syncNow.ts`: 同期実行
- `src/auth/signInWithEmail.ts`: メール認証

## 6. 共通ライブラリ / 型定義

- `src/lib/date.ts`: 日付ユーティリティ
- `src/lib/engagement.ts`: 継続度合いの算出
- `src/lib/heatmap365.ts`: 年間ヒートマップ
- `src/lib/history.ts`: 履歴ロジック
- `src/lib/morningLog.ts`: 朝ログ
- `src/lib/nightLog.ts`: 夜ログ
- `src/lib/notifications.ts`: 通知
- `src/lib/programDay.ts`: 学習日程ロジック
- `src/lib/reset.ts`: リセット処理
- `src/lib/settings.ts`: 設定ロジック
- `src/lib/storage.ts`: ストレージ共通
- `src/lib/supabase.ts`: Supabase 連携
- `src/lib/themePreference.ts`: テーマ設定
- `src/lib/todayLog.ts`: 今日のログ
- `src/lib/i18n/index.ts`: i18n 入口
- `src/lib/i18n/detectLocale.ts`: ロケール検出
- `src/lib/i18n/storage.ts`: i18n 設定保存
- `src/types/curriculum.ts`: カリキュラム型
- `src/types/formatjs-intl-pluralrules.d.ts`: 型定義補助
- `src/types/svg.d.ts`: SVG 型定義

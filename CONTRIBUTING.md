# Contributing

## 1PRは小さく
- 1PR = 画面1つ or ロジック1つが目安
- 目的が一文で説明できない変更は分割する

## レビュー観点
- UX: 連続を褒めない / 復帰を褒める / 迷わせない
- 例外: 失敗時に落ちない導線があるか
- 永続化: 保存/復元の漏れがないか
- 文言: 断定しない / 責めない / 短い

## ディレクトリ規約
- `src/app/`: Screens (Expo Router app root)
- `src/content/`: Content loaders (JSON -> typed data)
- `src/lib/`: Domain logic (day calculation, storage, notifications)
- `src/components/`: UI components (LearnCard, Button, etc.)
- `src/types/`: TypeScript types
- `content/`: Raw curriculum JSON

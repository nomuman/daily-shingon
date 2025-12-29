# Learning Docs (React / React Native / Expo)

このプロジェクト（まいにち真言 / Daily Shingon）は、アプリ開発だけでなく
React Native / React / Expo を段階的に習得するための教材でもある。

## まず読む順番（おすすめ）

1. `react_native_expo_learning_points.md`（最重要：全体像 + 0→中級）
2. `deep_dive_storage_and_focus.md`（“保存/復帰/最新反映”の基本が固まる）
3. `deep_dive_i18n_and_content.md`（UI文言 + コンテンツの多言語を固める）
4. `deep_dive_testing.md`（品質を上げるために最低限）

## 迷ったらここを見る（症状別）

- 画面遷移やタブで “戻ったのに更新されない”
  → `deep_dive_storage_and_focus.md`（useFocusEffect）
- RootLayout 周りで “Attempted to navigate before mounting…”
  → `react_native_expo_learning_points.md` の Router章
- 言語を変えたのにコンテンツが切り替わらない
  → `deep_dive_i18n_and_content.md`
- リストが重い/カクつく
  → `react_native_expo_learning_points.md` の FlatList/パフォーマンス章

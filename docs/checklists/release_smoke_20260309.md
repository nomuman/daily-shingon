# リリース前スモークテスト記録（2026-03-09向け）

最終更新: 2026-02-28

## 自動テスト（実施済み）

- [x] `npm run lint` 2026-02-28 PASS
- [x] `npm run typecheck` 2026-02-28 PASS
- [x] `npm test -- --runInBand` 2026-02-28 PASS（20 suites / 46 tests）
- [x] `npx expo-doctor` 2026-02-28 PASS（17/17）
- [x] `npm run export:web` 2026-02-28 PASS

## 手動テスト（未完了）

- [ ] iOS実機: 初回起動 / 朝保存 / 学び選択 / 夜保存 / 履歴表示 / リセット
- [ ] Android実機: 初回起動 / 朝保存 / 学び選択 / 夜保存 / 履歴表示 / リセット
- [ ] 通知: 許可拒否→再許可→再スケジュール（iOS/Android）
- [ ] 認証: サインアップ / サインイン / サインアウト / 同期実行
- [ ] ストア配布ビルド（Preview）で最終導線確認（Android build: `aad54933-8259-4179-9d17-7cca651d67f4` 完了）
- [ ] ストア配布ビルド（Production）で最終導線確認（Android build: `0a47b07c-f899-4a56-b234-30d63ac41976` 完了）
- [ ] iOS EAS credentials 設定後に Preview/Production ビルド実行

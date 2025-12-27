# EAS Build / Update 運用メモ

## 目的
- Preview build を配布して実機で確認できる状態にする
- OTA更新の基本ルール（JS/アセットのみ）を共有して運用事故を減らす

## 1. 初期セットアップ（要ログイン）
```bash
npx eas-cli init
```
- Expoアカウントでログインが必要
- 成功すると `app.json` に `extra.eas.projectId` が追加される

## 2. Preview build（チーム共有用）
```bash
npx eas-cli build --profile preview --platform all
```
- 配布リンクをチームへ共有

## 3. EAS Update（OTA運用）
```bash
npx eas-cli update:configure
```
- `app.json` に `updates.url` が追加される
- **OTAで直せるのはJS/アセットのみ**（ネイティブ変更はストア更新）

### 運用ルール（branch）
- dev: `dev`
- stg: `stg`
- prod: `prod`

例:
```bash
npx eas-cli update --branch dev --message "dev hotfix"
npx eas-cli update --branch stg --message "staging test"
npx eas-cli update --branch prod --message "prod fix"
```

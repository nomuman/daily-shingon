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

## 2.5 環境変数（Supabase）の注入

`EXPO_PUBLIC_*` はビルド時に埋め込まれるため、リポジトリ直書きではなく EAS Secrets を使う。

```bash
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT.supabase.co"
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value "YOUR_PUBLISHABLE_KEY"
```

確認:

```bash
npx eas-cli secret:list
```

更新が必要な場合:

```bash
npx eas-cli secret:delete --scope project --name EXPO_PUBLIC_SUPABASE_URL
npx eas-cli secret:delete --scope project --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

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

## 4. 本番向けビルド番号運用

- iOS: `app.json` の `expo.ios.buildNumber` を申請ごとに +1
- Android: `app.json` の `expo.android.versionCode` を申請ごとに +1
- OTA: 今回の1.0リリースでは `runtimeVersion` は未設定（`expo-updates` 導入時に方針決定）

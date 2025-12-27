# Expo 最新版キャッチアップ（ジュニア向け / TypeScript経験あり）
最終更新: 2025-12  
この資料のゴール: **これを読めば開発が始められる**（Router / Storage / 通知 / EASビルドまで）

---

## 0. Expoの全体像（まずここだけ）
Expoは「React Nativeを、素早く作って配布するためのフレームワーク＋ツール群」です。:contentReference[oaicite:2]{index=2}

このプロジェクトで使う“柱”は4つ：

1. **Expo SDK**：通知やストレージ等の機能（`expo-notifications` など）
2. **Expo Router**：画面遷移（ファイルベースで `app/` がルート）:contentReference[oaicite:3]{index=3}
3. **Development Server**：`npx expo start` で開発する:contentReference[oaicite:4]{index=4}
4. **EAS**：ビルド/配布/OTA更新（EAS Build / Update など）:contentReference[oaicite:5]{index=5}

---

## 1. 最短で起動する（15分）
### 1.1 起動
- 開発サーバ起動:
  - `npx expo start` :contentReference[oaicite:6]{index=6}

### 1.2 パッケージ追加の基本
- 依存を入れるときは基本：
  - `npx expo install <package>`
- 理由：Expo SDKと互換性のあるバージョンが入る（事故りにくい）。:contentReference[oaicite:7]{index=7}

---

## 2. Expo Router（最重要）
### 2.1 ルール：これだけ覚えればOK
- `app/` 配下のファイル構成がそのままルート（file-based routing）:contentReference[oaicite:8]{index=8}
- `_layout.tsx` は「その階層の共通レイアウト」（Stack/Tabsなど）:contentReference[oaicite:9]{index=9}
- `+not-found.tsx` は「存在しないルートに行ったときの画面」:contentReference[oaicite:10]{index=10}
- `(tabs)` みたいなカッコ付きフォルダは「URLに出ないグルーピング」:contentReference[oaicite:11]{index=11}

### 2.2 このプロジェクトの基本構造（覚える）
例：
```

app/
_layout.tsx            # ルートレイアウト
+not-found.tsx         # NotFound
(tabs)/
_layout.tsx          # Tabs定義
index.tsx            # Home
learn.tsx            # Learn
settings.tsx         # Settings

```

Tabs公式例（この構造そのものが載ってる）:contentReference[oaicite:12]{index=12}

### 2.3 “ルートが出ない”ときの典型原因
- `app/` が存在しない or `app/_layout.tsx` を消した
- ファイル名が違う（`_layout.tsx` じゃない）
- キャッシュが悪さしてる（後述の「困ったとき」へ）

Routerの特殊ファイル命名ルールはここで確認：:contentReference[oaicite:13]{index=13}

---

## 3. Expo Go と Development Build の違い（ここで詰まりがち）
### 3.1 ざっくり
- **Expo Go**：すぐ動く。が、使えるネイティブ機能が制限されることがある
- **Development Build**：自分専用の“強化版Expo Go”を作るイメージ。ネイティブ機能の自由度が上がる

※通知などは実機＋Dev Buildが必要になりやすいので、詰まったら「Dev Buildに寄せる」判断をする。:contentReference[oaicite:14]{index=14}

---

## 4. TypeScript（このプロジェクトでの約束）
### 4.1 型の置き場所
- `src/types/` に集約
- JSONコンテンツ（30日カリキュラム）は必ず型を当てる

### 4.2 重要：JSON import
TSでJSONをimportする場合、`tsconfig` に `resolveJsonModule` が必要なことがある（プロジェクト状態による）。

---

## 5. データ保存（まずはAsyncStorage）
このアプリはまずローカル保存が中心。  
用途：開始日・今日の選択・朝/夜ログなど（小さめのデータ）。

- Expoの環境変数/ガイドと合わせて、まずは軽い保存で進める（後でSQLite移行も可能）。:contentReference[oaicite:15]{index=15}

---

## 6. 環境変数（.env）
### 6.1 ルール
- Expoでアプリ内から参照したい値は **`EXPO_PUBLIC_`** を付ける :contentReference[oaicite:16]{index=16}
  - 例：`EXPO_PUBLIC_API_BASE_URL=...`
- 参照：`process.env.EXPO_PUBLIC_API_BASE_URL`

> `EXPO_PUBLIC_` は「アプリに含まれうる」ので秘密情報を入れない。:contentReference[oaicite:17]{index=17}

### 6.2 EAS（クラウドビルド）側の環境変数
EAS側でも環境変数を管理できる（ビルド環境ごとに変えられる）。:contentReference[oaicite:18]{index=18}

---

## 7. EAS（ビルド配布の柱）
### 7.1 まずは“preview build”を作る（チーム配布用）
- 目的：手元だけでなく、他の端末でも同じ動作を確認できる状態を作る
- EAS環境変数やビルド設定の理解も同時に進む :contentReference[oaicite:19]{index=19}

---

## 8. 困ったとき（最頻出の対処）
### 8.1 キャッシュ問題
- まずは開発サーバを止めて再起動
- ダメなら “キャッシュクリア” を検討（チームの標準手順をREADMEに書く）

### 8.2 ルーティングがおかしい
- `app/` と `_layout.tsx` と `+not-found.tsx` を確認 :contentReference[oaicite:20]{index=20}

### 8.3 Expo Goで機能が動かない
- Dev Buildに寄せる（“機能制限”を疑う）

---

## 9. このアプリで“最低限できればOK”な到達点（チェック式）
- [ ] `npx expo start` で起動できる :contentReference[oaicite:21]{index=21}
- [ ] Tabsが表示される（Home/Learn/Settings）:contentReference[oaicite:22]{index=22}
- [ ] `content/curriculum/30days.ja.json` を読み込み、DayNが表示できる
- [ ] 開始日（YYYY-MM-DD）を保存し、Day計算できる
- [ ] `+not-found.tsx` が機能する :contentReference[oaicite:23]{index=23}
- [ ] `.env` の `EXPO_PUBLIC_` が参照できる :contentReference[oaicite:24]{index=24}
- [ ] EASでpreview buildが作れて配れる :contentReference[oaicite:25]{index=25}

---

## 10. 参考リンク（公式）
- Start developing（`npx expo start`）:contentReference[oaicite:26]{index=26}
- Expo Router（SDKページ）:contentReference[oaicite:27]{index=27}
- Router notation（特殊ファイル/命名）:contentReference[oaicite:28]{index=28}
- Tabs（Router）:contentReference[oaicite:29]{index=29}
- Environment variables（Expo）:contentReference[oaicite:30]{index=30}
- Environment variables（EAS）:contentReference[oaicite:31]{index=31}
- Expo公式：フォルダ構成ベストプラクティス（Router前提）:contentReference[oaicite:32]{index=32}

---

## 11. リポジトリ運用（読ませ方）
- このファイルは `docs/onboarding/expo_latest_catchup.md`
- ルート `README.md` にリンクを貼る（新人が迷わない）:contentReference[oaicite:33]{index=33}
```

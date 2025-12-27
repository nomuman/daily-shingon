# 実装チェックリスト（ジュニア向け / Expo初挑戦）
Goal: 「最高の体験」を落とさず、確実にリリースできる品質で実装する  
Scope: Expo + Expo Router / 30日カリキュラム（JSON） / 朝・学び・夜 / ローカル保存 / 通知 / EASビルド

---

## 0. このチェックリストの使い方
- すべての項目は **チェックボックス**で管理する
- 各タスクは **Definition of Done（DoD）** を満たしたら✅
- 実装途中で迷ったら、まず公式ドキュメントを参照（リンクは各章）  
  - create-expo-app :contentReference[oaicite:0]{index=0}
  - Expo Router（_layout/tabs/not-found） :contentReference[oaicite:1]{index=1}
  - Store Data / AsyncStorage :contentReference[oaicite:2]{index=2}
  - Notifications :contentReference[oaicite:3]{index=3}
  - ESLint/Prettier :contentReference[oaicite:4]{index=4}
  - Jest :contentReference[oaicite:5]{index=5}
  - EAS Build / Update :contentReference[oaicite:6]{index=6}

---

## A. プロジェクト準備（開発が詰まらないための土台）

### A1. ローカル環境
- [x] Node / npm（または pnpm/yarn）をインストール
- [x] Expo CLIの基本操作を理解（start / run / install）
- [x] 実機（iOS/Android）で動かす準備（通知は実機必要が多い） :contentReference[oaicite:7]{index=7}

**DoD**
- `npx expo start` がエラーなく起動し、端末で表示できる

---

### A2. 初期生成・構成
- [x] `create-expo-app` でプロジェクト作成（テンプレはExpo Router前提） :contentReference[oaicite:8]{index=8}
- [x] `app/` 配下がルーティングの中心だと理解（file-based routing） :contentReference[oaicite:9]{index=9}
- [x] `app/_layout.tsx` と `app/(tabs)/_layout.tsx` の役割を理解 :contentReference[oaicite:10]{index=10}
- [x] `+not-found.tsx` を用意して未定義ルートを安全に処理 :contentReference[oaicite:11]{index=11}

**DoD**
- タブ（Home/Learn/Settings）が表示され、存在しないルートに行くとNotFound画面になる

---

### A3. 環境変数・設定
- [x] `.env` を導入（公開OKなものは `EXPO_PUBLIC_` 接頭辞） :contentReference[oaicite:12]{index=12}
- [x] `app.json` / `app.config.ts` の役割を理解（OTAやビルド設定の根本） :contentReference[oaicite:13]{index=13}
- [x] `EXPO_PUBLIC_` を `process.env` で参照できることを確認 :contentReference[oaicite:14]{index=14}

**DoD**
- `.env` の値がアプリ起動時に読み込まれ、ログに出せる（本番ではログに出さない）

---

## B. 開発品質（“スーパーなExpoエンジニア”の土台）

### B1. フォーマット・Lint
- [x] Expo推奨の ESLint/Prettier セットアップ :contentReference[oaicite:15]{index=15}
- [x] `npm run lint`（or `npx expo lint`）をCIで実行できる状態にする
- [x] import順・unused・any濫用を抑制（ルールを決めて統一）

**DoD**
- PRごとにLintが通る（落ちたら直すまでマージ不可）

---

### B2. テスト（最低ライン）
- [x] Jestのセットアップ（`jest-expo`） :contentReference[oaicite:16]{index=16}
- [x] 純粋関数（day計算 / JSONローダー）をユニットテスト
- [x] 重要UI（LearnCard）が崩れないスナップショット or 画面レンダリングテスト

**DoD**
- `npm test` が通る
- “Day計算”に境界値テスト（Day1/Day30/31以降）あり

---

### B3. エラーハンドリング
- [ ] Routerのエラーハンドリング方針に従う（NotFound / Error UI） :contentReference[oaicite:17]{index=17}
- [ ] JSON読み込み失敗時のフォールバックUI
- [ ] AsyncStorage読み書き失敗時のリトライ or “再起動案内”導線

**DoD**
- 例外でアプリが落ちず、ユーザーが次の行動を取れる

---

## C. アーキテクチャ（迷子を作らない）

### C1. ディレクトリ規約（固定）
- [ ] `app/`：画面（ルーティング）
- [ ] `src/content/`：コンテンツ読み込み（JSON→型）
- [ ] `src/lib/`：ロジック（Day計算/保存/通知）
- [ ] `src/components/`：UI部品（LearnCard/Button等）
- [ ] `src/types/`：TypeScript型

**DoD**
- “どこに何を書くか”が README/CONTRIBUTING で説明されている

---

### C2. 型安全（落ちないアプリ）
- [ ] `Curriculum30` / `CurriculumDay` の型を固定
- [ ] JSONの必須項目欠けを検知（起動時にvalidateしてログ→フォールバック）
- [ ] `SanmitsuKey = body|speech|mind` を全体で統一

**DoD**
- `content/curriculum/30days.ja.json` の破損があっても即クラッシュしない

---

## D. コンテンツ（30日カリキュラム）の実装

### D1. JSON取り込み
- [ ] `content/curriculum/30days.ja.json` をリポジトリに配置
- [ ] `resolveJsonModule` の有効化（TSでimport）※必要なら
- [ ] `getDayCard(day)` を実装し 1..30 のクランプ保証

**DoD**
- Day1/Day30/Day999 を渡しても常にカードが返る

---

### D2. 出典（sources）の扱い
- [ ] JSONにある `sources` はIDで保持し、画面ではID表示（まずは）
- [ ] 将来URLを表示する場合は「アプリ内でURL直書きしない」方針を守る（別画面で表示）

**DoD**
- Learn画面に「参考：SRC_...」が表示される

---

## E. コアUX（朝・学び・夜）※このプロダクトの命

### E1. 画面の最小セット
- [ ] Home（今日の状況が1秒でわかる）
- [ ] Learn（今日のカード）
- [ ] Morning（身/口/意の“短い整え”）
- [ ] Night（懺悔→発願→回向）
- [ ] Settings（通知・開始日リセット・問い合わせ等）

**DoD**
- どの画面も「次に何をすればいいか」が1つだけ目立つ

---

### E2. “復帰を称える”の実装（重要）
- [ ] 連続日数より「戻れた」をメッセージ優先
- [ ] 途切れた翌日は「また始めた」を出す（スコアで煽らない）
- [ ] Day31以降は“完走後モード”（固定メッセージ + 任意でリセット）

**DoD**
- 3日空けてもアプリが責めない（UX文言レビュー済）

---

### E3. タップ領域・可用性
- [ ] 主要ボタンは最低 44x44pt を満たす :contentReference[oaicite:18]{index=18}
- [ ] 1画面のPrimary CTAは原則1つ（迷わせない）
- [ ] 長文は避け、スクロールが必要なら見出しで区切る

**DoD**
- 片手操作で誤タップしにくい

---

## F. データ永続化（ローカル保存）

### F1. 保存するデータ定義（最小）
- [ ] curriculum startDate（YYYY-MM-DD）
- [ ] 今日選んだ「行い」(body/speech/mind + text)
- [ ] 朝チェック（身/口/意：done/時刻）
- [ ] 夜ログ（懺悔/発願/回向：選択 + メモ任意）

### F2. AsyncStorage 実装
- [ ] Expo推奨手順で AsyncStorage を導入 :contentReference[oaicite:19]{index=19}
- [ ] Key命名を固定（例：`curriculum30:startDateISO`）
- [ ] すべての read/write を `src/lib/storage.ts` に集約
- [ ] マイグレーション方針（将来SQLiteに移行も視野）  
  - ExpoはStore data guideで用途別選択を案内 :contentReference[oaicite:20]{index=20}

**DoD**
- アプリ再起動しても、開始日・今日の選択が維持される

---

## G. 通知（継続の背骨）

### G1. expo-notifications 導入
- [ ] `expo-notifications` の導入・権限リクエスト :contentReference[oaicite:21]{index=21}
- [ ] 朝通知（例：7:30）/ 夜通知（例：21:30）をスケジュール
- [ ] スケジュール内容を Settings で ON/OFF 可能にする
- [ ] 権限拒否時のフォールバック（設定アプリへ誘導文言）

**DoD**
- 実機で「指定時刻」にローカル通知が届く（iOS/Android） :contentReference[oaicite:22]{index=22}

---

## H. ルーティング（Expo Router）

### H1. ルーティング規約
- [ ] `app/(tabs)/_layout.tsx` でTabsを定義 :contentReference[oaicite:23]{index=23}
- [ ] Root `app/_layout.tsx` の責務を理解 :contentReference[oaicite:24]{index=24}
- [ ] NotFound（`+not-found.tsx`） :contentReference[oaicite:25]{index=25}

**DoD**
- 画面追加で迷わない（“ファイルを作ればルートになる”を体得）

---

## I. ビルド・リリース（EAS）

### I1. EAS Build（まず動くバイナリを作る）
- [ ] `eas` セットアップ
- [ ] `eas build` で preview build を作る（配布して確認） :contentReference[oaicite:26]{index=26}
- [ ] iOS/Androidの署名周りの扱いを理解（EASが支援） :contentReference[oaicite:27]{index=27}

**DoD**
- チームの端末にインストールできる “preview build” が配れる

---

### I2. EAS Update（運用を楽にする）
- [ ] expo-updates と EAS Update の概念理解 :contentReference[oaicite:28]{index=28}
- [ ] “JS/アセットはOTAで直せるが、ネイティブ変更はストア更新” を理解 :contentReference[oaicite:29]{index=29}
- [ ] update channel/branch の運用方針を決める（dev/stg/prod）

**DoD**
- 軽微な修正をOTAで反映できる（本番運用の事故を減らす）

---

## J. 仕上げ品質（最高のアプリにする）

### J1. アクセシビリティ（最低限）
- [ ] フォントサイズを固定しすぎない（拡大で破綻しない）
- [ ] 重要ボタンに明確なラベル
- [ ] コントラスト不足のテキストを作らない

**DoD**
- 文字サイズを大きくしても主要導線が壊れない

---

### J2. パフォーマンス（最初から守る）
- [ ] 1画面で過剰な再レンダリングをしない（状態は局所化）
- [ ] JSONは1回ロードして使い回す
- [ ] ログ一覧は必要になったら仮想化（FlatList）

**DoD**
- スクロールが引っかからない

---

### J3. セキュリティ/プライバシー（まずは“やらない”を決める）
- [ ] 個人情報を収集しない（MVPではログは端末内のみ）
- [ ] 課金やアカウント導入は次フェーズ（先にUX完成）
- [ ] 保存データに機密が出るなら SecureStore 検討（必要になったら） :contentReference[oaicite:30]{index=30}

**DoD**
- “収集しない設計”が docs に明記されている

---

## K. PR運用（ジュニアでも崩れない）

### K1. ブランチ・PRテンプレ
- [ ] 1PRは小さく（画面1つ or ロジック1つ）
- [ ] PRテンプレ：目的 / 変更点 / 動作確認 / スクショ
- [ ] Reviewerが見る観点：UX / 例外 / 永続化 / 文言

**DoD**
- PRが「何をしたか」3分で理解できる

---

## L. 具体タスク分割（実装順・MECE）

### L1. フェーズ1（表示だけ）
- [ ] Learn画面：今日のDayカード表示（JSON import）
- [ ] Day計算：startDate保存＋day算出（AsyncStorage）
- [ ] NotFound導入
- [ ] UI部品：Card / Button 最小

### L2. フェーズ2（行動の保存）
- [ ] “今日の行い”選択→保存
- [ ] Homeに今日の行い表示
- [ ] 朝チェック（身/口/意 3つ）保存
- [ ] 夜（懺悔/発願/回向）保存

### L3. フェーズ3（継続装置）
- [ ] ローカル通知（朝/夜）設定
- [ ] Settingsで通知ON/OFF
- [ ] 途切れ→復帰メッセージ

### L4. フェーズ4（リリース品質）
- [ ] Jest（day計算 / storage）テスト
- [ ] ESLint/Prettier強制
- [ ] EAS preview build配布
- [ ] EAS Update導入（運用設計）

---

## 付録：必ず守る“プロダクトの一行原則”
- **連続を褒めない。復帰を褒める。**
- **学びは短く。行いは1つ。問いは1つ。**
- **断定しない。責めない。敬意を保つ。**

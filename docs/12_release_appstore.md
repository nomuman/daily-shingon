# iOS実機リリース（App Store公開）手順（Expo + EAS）

了解、Expo（EAS）で **iOSを実機リリース（App Store公開）** まで進める手順を、詰まるポイント込みで順番にまとめるね。
（基本は *EAS Build → EAS Submit → TestFlight → App Review → 公開* の流れ）

---

## 0.5 このリポジトリで確認できた対応状況（2025-12-30）

### 既に揃っている/設定済み

* ✅ Bundle ID: `com.nomuman.dailyshingon`（`app.json`）
* ✅ `version`: `1.0.0`（`app.json`）
* ✅ EAS Project ID: `68881611-d222-43df-852b-d8cb00796125`（`app.json`）
* ✅ `eas.json` の build/submit プロファイル（`eas.json`）
* ✅ プライバシーポリシー公開ページ（`docs/privacy/index.html`）とURL設定（`app.json` の `extra.privacyPolicyUrl`）
* ✅ お問い合わせページ（`docs/contact/index.html`）とURL設定（`app.json` の `extra.contactUrl`）
* ✅ App Store 用説明文ドラフト（`docs/store/app_store_ja.md`）
* ✅ プライバシーポリシードラフト（`docs/store/privacy_policy_ja.md`）
* ✅ リリースTODOチェックリスト（`docs/checklists/release_todo.md`）

### まだ埋める/確認が必要

* ⛳ iOS `buildNumber`（`app.json` に追加・審査ごとに更新）
* ⛳ Apple Developer Program / App Store Connect の口座（外部作業）
* ⛳ App Store Connect での新規アプリ作成（外部作業）
* ⛳ スクリーンショット作成（リポジトリ外の成果物）
* ⛳ サポート連絡先の確定（`docs/store/support_ja.md` が TODO）
* ⛳ App Privacy Details 入力（App Store Connect 側で実施）

## 0. 事前に用意するもの（ここが揃ってないと先に進めない）

* **Apple Developer Program**（有料）に加入
* **App Store Connect** にログインできる Apple ID（上と同じ組織/個人でOK）
* **Expo アカウント**
* `eas-cli`（EASのコマンド）

Expo公式の提出手順（iOS）と Submit 全体の説明：([Expo Documentation][1])

---

## 1. Expo側の設定を固める（bundleIdentifier は超重要）

`app.json` / `app.config.ts` に最低限これを設定：

* `ios.bundleIdentifier`（一意。後から変えるのは大変）
  - このプロジェクト: `com.nomuman.dailyshingon`
* `version`（例: 1.0.0）
  - このプロジェクト: `1.0.0`
* `ios.buildNumber`（審査ごとに上げる数値）
  - このプロジェクト: **未設定**（`app.json` に追加が必要）
* アイコン/表示名など（ストアで見える）

Expo側の「ストア提出の前提」：bundleIdentifier が必要 ([Expo Documentation][2])

> よくある罠
>
> * `bundleIdentifier` を適当に付けて後で直したくなる（App Store Connect 側の紐付けが面倒）
> * iOS権限（通知/カメラ等）を使うのに、Info.plist 相当の説明文が足りずリジェクト

---

## 2. EAS 設定ファイル（eas.json）を作る

プロジェクトルートで：

```bash
npm i -g eas-cli
eas login
eas build:configure
```

`eas.json` は EAS Build の設定ファイルで、ここに build プロファイルを持つ。([Expo Documentation][3])

このプロジェクトでは `eas.json` がすでに存在し、`production` プロファイルと `submit.production` が設定済み。
`app.json` に `extra.eas.projectId` も設定済み。

---

## 3. まずは配布テスト（おすすめ：internal / TestFlight）

リリース前に「本番に近いビルド」を実機で触れる状態にすると、審査前に潰せる。

### A) チーム内だけで配る（internal distribution）

* すぐ配れて、フィードバック取りやすい（URLで入れられる） ([Expo Documentation][4])

### B) TestFlight で配る（本番フローと同じに近い）

このあと「提出→TestFlight」でやる方法でもOK（むしろ王道）。

---

## 4. App Store Connect に「アプリ枠」を作る

App Store Connect で **New App（新規App）** を作成する。
手順の公式説明：([Apple Developer][5])

ここで必要になる代表例：

* App名
* Bundle ID（Expoの `ios.bundleIdentifier` と一致させる）
* SKU（内部管理用の一意文字列）

---

## 5. 本番ビルド（.ipa）を EAS Build で作る

iOS の production build：

```bash
eas build --platform ios --profile production
```

production がデフォルトなら `--profile production` は省略できる（Expoチュートリアルでもそう説明）([Expo Documentation][6])

---

## 6. 提出（EAS Submit）で App Store Connect にアップロード

### A) ビルド後に手動で submit

```bash
eas submit --platform ios --latest
```

EAS Submit は “ストアへ提出するためのサービス” ([Expo Documentation][7])

### B) ビルド完了後に自動で submit（楽）

```bash
eas build --platform ios --profile production --auto-submit
```

`--auto-submit` で Build → Submit を自動化できる ([Expo Documentation][8])

> ここで App Store Connect の **API Key** 設定が求められることが多い
> Expo側の iOS 提出手順に「App Store Connect API Key を設定できる」説明あり ([Expo Documentation][1])

---

## 7. TestFlight で配布テスト

App Store Connect → TestFlight でビルドが “Processing” → “Ready to Test” になったら

* Internal Testers（社内/自分）に配る
* External Testers は **Beta App Review** が入ることがある（必要なら）

（ここでクラッシュ/権限/ログイン導線などを潰す）

---

## 8. ストア掲載情報を埋める（審査で見られる）

Apple公式の「提出時に用意するもの（プロダクトページ）」：([Apple Developer][9])

最低限：

* スクリーンショット（iPhone必須。iPad対応ならiPad分も）
* 説明文、サブタイトル、キーワード
* カテゴリ、年齢制限（Age Rating）
* サポートURL / プライバシーポリシーURL

このプロジェクトでは、ドラフト文章が `docs/store/app_store_ja.md` に用意済み。
URLは `app.json` の `extra.privacyPolicyUrl` / `extra.contactUrl` を参照（公開されているかは要確認）。

---

## 9. App Privacy（プライバシー表示）を設定

App Store Connect の **App Privacy Details**（いわゆるプライバシーラベル）は必須級。
「何を収集し、どう使うか」を申告する仕組み ([Apple Developer][10])

このプロジェクトのプライバシーポリシー（`docs/privacy/index.html`）では「外部送信なし」前提になっているため、
実際のSDK利用状況と一致しているかを必ず突合せる。

> ここも罠ポイント
>
> * SDK（分析/広告/クラッシュ）を入れてるのに “収集なし” にすると不整合でリジェクト/後で問題になりがち
> * 逆に収集してないなら「収集しない」を明確にできて強い

---

## 10. 審査提出（Submit for Review）

App Store Connect の提出フロー概要（公式）：([Apple Developer][11])

やること（代表）：

* 審査に出す「バージョン」を作る
* そのバージョンに “提出したビルド” を紐付ける
* 輸出コンプライアンス（暗号化）などの質問に回答
* 連絡先、審査メモ（ログインが必要ならテストアカウント）を入力
* Submit for Review

このプロジェクトは `ITSAppUsesNonExemptEncryption: false` が `app.json` に設定済み。

---

## 11. 公開（Release）

承認されたら公開設定：

* 自動公開（承認後すぐ）
* 手動公開（自分のタイミングで Release）

---

## よくある詰まりどころ（先回りチェック）

* **bundleIdentifier の不一致**（Expo設定と App Store Connect のズレ）
* **buildNumber を上げ忘れ**（同じ番号は再提出できない）
* **権限説明文不足**（通知/写真/カメラなど）
* **プライバシー申告と実態のズレ**（SDK含む）
* **審査用の案内不足**（ログイン方法、機能の場所、課金の有無など）

---

もし、いまの状況が

* もう `eas.json` ある / ない
* `expo-notifications` や `expo-camera` を使ってる / 使ってない
* 課金（IAP/サブスク）を今回入れる / 入れない

あたりが分かると、**「あなたのアプリ前提のチェックリスト」**に落として、提出までのコマンドと設定箇所をピンポイントに書けるよ。

[1]: https://docs.expo.dev/submit/ios/?utm_source=chatgpt.com "Submit to the Apple App Store"
[2]: https://docs.expo.dev/deploy/submit-to-app-stores/?utm_source=chatgpt.com "Submit to app stores"
[3]: https://docs.expo.dev/build/eas-json/?utm_source=chatgpt.com "Configure EAS Build with eas.json"
[4]: https://docs.expo.dev/build/internal-distribution/?utm_source=chatgpt.com "Internal distribution"
[5]: https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app/?utm_source=chatgpt.com "Add a new app - Create an app record - App Store Connect"
[6]: https://docs.expo.dev/tutorial/eas/ios-production-build/?utm_source=chatgpt.com "Create a production build for iOS"
[7]: https://docs.expo.dev/submit/introduction/?utm_source=chatgpt.com "EAS Submit"
[8]: https://docs.expo.dev/build/automate-submissions/?utm_source=chatgpt.com "Automate submissions"
[9]: https://developer.apple.com/app-store/submitting/?utm_source=chatgpt.com "Submitting - App Store"
[10]: https://developer.apple.com/app-store/app-privacy-details/?utm_source=chatgpt.com "App Privacy Details - App Store"
[11]: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/overview-of-submitting-for-review/?utm_source=chatgpt.com "Overview of submitting for review - Manage submissions to ..."

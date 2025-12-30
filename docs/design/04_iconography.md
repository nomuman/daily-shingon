# アイコン/絵文字 カスタム化計画（MECE）

目的：アプリ内の絵文字・アイコンをすべて自作に置き換え、体験の一貫性を高める。

---

## 1. 対象範囲（MECE）

### A. ブランド/プラットフォーム用アセット（画像ファイル）

- App Icon（iOS/共通）: `assets/images/icon.png`（`app.json` の `expo.icon`）
- Android Adaptive Icon
  - Foreground: `assets/images/android-icon-foreground.png`
  - Background: `assets/images/android-icon-background.png`
  - Monochrome: `assets/images/android-icon-monochrome.png`
- Splash 画像: `assets/images/splash-icon.png`（`app.json` の `expo-splash-screen.image`）
- Web favicon: `assets/images/favicon.png`

### B. ナビ/セクション用アイコン（UI）

- Today / Home（家）
- Learn（本）
- Morning（太陽）
- Night（月/星）
- Settings（歯車）
  参照: `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/index.tsx`

### C. 行動/CTA用アイコン（UI）

- 進む矢印（forward）
- 北東矢印（north-east）
  参照: `src/app/(tabs)/index.tsx`

### D. 状態/記号アイコン（絵文字置換）

- 完了: ✅
- 未完了: ⬜️
- メモあり: 📝
  参照: `src/app/(tabs)/morning.tsx`, `src/app/(tabs)/night.tsx`, `src/app/(tabs)/index.tsx`,
  `src/locales/ja/common.json`, `src/locales/en/common.json`

---

## 2. 共通アイコンセット（アプリ内 UI）

デザイナー発注用の「最低限必要なセット」。

| ID                 | 意味         | 使用サイズ(目安) | 主な出現箇所                |
| ------------------ | ------------ | ---------------- | --------------------------- |
| icon-home          | Today / Home | 24               | タブバー                    |
| icon-learn         | Learn        | 24               | タブバー / Homeの学びカード |
| icon-morning       | Morning      | 24 / 20          | タブバー / Homeの朝カード   |
| icon-night         | Night        | 24 / 20          | タブバー / Homeの夜カード   |
| icon-settings      | Settings     | 24               | タブバー                    |
| icon-arrow-forward | 進む         | 20               | HomeのPrimary CTA           |
| icon-arrow-ne      | 北東矢印     | 18               | Homeの「年の詳細」CTA       |

備考:

- タブバーは `TabIcon` で `size ?? 24` を使用。
- Homeのバッジは `size={20}`、北東矢印は `size={18}`。

---

## 3. 絵文字置換セット（状態/記号）

| ID           | 置換対象 | 用途       |
| ------------ | -------- | ---------- |
| icon-check   | ✅       | 完了状態   |
| icon-uncheck | ⬜️       | 未完了状態 |
| icon-memo    | 📝       | 夜メモあり |

---

## 4. 画面別 出現箇所マップ（実装側の差し替えポイント）

- タブバー: `src/app/(tabs)/_layout.tsx`
  - Today / Learn / Morning / Night / Settings の5種
- Home: `src/app/(tabs)/index.tsx`
  - Primary CTA: `arrow-forward`
  - 年の詳細 CTA: `north-east`
  - 朝/学び/夜のアイコンバッジ: `wb-sunny` / `menu-book` / `nights-stay`
  - 夜メモ表示: `📝`
- Morning: `src/app/(tabs)/morning.tsx`
  - チェック項目に `✅` / `⬜️`
- Night: `src/app/(tabs)/night.tsx`
  - チェック項目に `✅` / `⬜️`
- 文言中の絵文字: `src/locales/ja/common.json`, `src/locales/en/common.json`
  - `doneEmoji`: `Done ✅`

---

## 5. 仕様ガイド（デザイナー向け）

### トーン/スタイル

- 単色（1色運用前提）で成立するデザイン
- 角は柔らかめ（round cap / round join 推奨）
- 余白多めで、アプリ全体の静けさに合わせる

### サイズ/グリッド

- 主要: 24x24（タブバー）
- 補助: 20x20（バッジ/小アイコン）
- 小サイズ: 18x18（北東矢印）
- 出力はベクターを推奨（SVG）。必要ならPNGでもOK

### 使い分け

- タブバーは「塗り」寄りの太めでも視認性が高い
- 文中/ボタン内は輪郭が簡素な方が読みやすい

---

## 6. 納品形式の希望

### UIアイコン

- SVG（1色で色変更しやすい）
- viewBox を揃える（24/20/18 のいずれか）
- ファイル名は `icon-xxx.svg` で統一

### アプリアセット（ブランド）

- PNG（既存ファイル名・パスに上書き予定）
- アセット出力サイズは Expo の最新仕様に合わせる

---

## 7. 実装/差し替え手順（作成後）

1. アイコン素材を配置
   - 例: `src/assets/icons/` に SVG を追加
   - アプリ用画像は `assets/images/` を上書き

2. UIアイコンを置換
   - `src/app/(tabs)/_layout.tsx`: タブアイコンをカスタムに差し替え
   - `src/app/(tabs)/index.tsx`: バッジ/CTAのアイコンを差し替え

3. 絵文字を置換
   - `src/app/(tabs)/morning.tsx`
   - `src/app/(tabs)/night.tsx`
   - `src/app/(tabs)/index.tsx`（📝）
   - `src/locales/ja/common.json`, `src/locales/en/common.json`（`doneEmoji`）

4. 依存削除（必要なら）
   - `expo-symbols` や `@expo/vector-icons` の参照を削る
   - 使わなくなったら `package.json` から依存整理

5. 最終確認
   - 主要画面で表示崩れがないか確認
   - iOS/Android でタブバーの視認性を確認

---

## 8. 次の選択（必要なら）

- A: デザイナー向けに「実寸+参考スクショ付き」発注資料を作る
- B: 実装用の「アイコンコンポーネント雛形」を作る

---

Below are the **English prompts** I used (and recommend reusing) to create the **SVG icon set** (Home / Learn / Morning / Night / Settings / arrows / check / uncheck / memo). They’re written to keep everything **monochrome, calm, rounded, lots of whitespace**, and consistent across the set.

---

## Global prompt (apply to every icon)

**Prompt:**

> Design a minimal, monochrome SVG icon for a calm meditation / daily mantra app brand. Style: single-color stroke only, no fills (unless explicitly requested), rounded caps and rounded joins, generous whitespace, soft corners, modern but quiet, not playful, not corporate. Make it readable at small sizes. Use a consistent stroke thickness across the set. Output as clean SVG with `fill="none"` and `stroke="currentColor"`. Avoid text, avoid gradients, avoid shadows. Center the shape in the canvas. Use a `viewBox` matching the target size (24x24 unless specified). Keep shapes simple and balanced.

---

## Per-icon prompts

### 1) icon-home (24x24)

**Prompt:**

> Create a monochrome SVG “Home” icon for a quiet ritual app. Use a simple house silhouette with a soft roof line and a small doorway hint. Rounded caps/joins, generous inner margins. Stroke-only, `stroke="currentColor"`, `fill="none"`. 24x24 viewBox. Minimal details, calm and centered.

### 2) icon-learn (24x24)

**Prompt:**

> Create a monochrome SVG “Learn / Book” icon. Depict an open book with two pages, subtle spine, quiet symmetry. Rounded caps/joins, stroke-only, `stroke="currentColor"`, `fill="none"`. 24x24 viewBox. Keep it simple and readable at 20–24px.

### 3) icon-morning (24x24)

**Prompt:**

> Create a monochrome SVG “Morning” icon. Use a simple sun with a circular center and short, evenly spaced rays. Rounded caps/joins, stroke-only, `stroke="currentColor"`, `fill="none"`. 24x24 viewBox. Calm, balanced, not spiky.

### 4) icon-night (24x24)

**Prompt:**

> Create a monochrome SVG “Night” icon. Use a crescent moon with one small star accent (minimal). Rounded caps/joins, mostly stroke-only with an optional tiny filled star for clarity. 24x24 viewBox. Keep the crescent smooth and quiet.

### 5) icon-settings (24x24)

**Prompt:**

> Create a monochrome SVG “Settings” icon. Use a simplified gear: clean outer ring with a few rounded teeth, and a small inner circle. Rounded caps/joins, stroke-only, `stroke="currentColor"`, `fill="none"`. 24x24 viewBox. Avoid excessive detail; readable at small size.

### 6) icon-arrow-forward (20x20)

**Prompt:**

> Create a monochrome SVG “Arrow Forward” icon for a primary CTA. A simple right-pointing arrow with a straight stem and a rounded arrowhead. Rounded caps/joins, stroke-only, `stroke="currentColor"`, `fill="none"`. 20x20 viewBox. Clear and calm.

### 7) icon-arrow-ne (18x18)

**Prompt:**

> Create a monochrome SVG “North-East” arrow icon for a secondary CTA. A diagonal arrow pointing up-right with a minimal corner/arrowhead. Rounded caps/joins, stroke-only, `stroke="currentColor"`, `fill="none"`. 18x18 viewBox. Keep it compact and readable.

### 8) icon-check (24x24)

**Prompt:**

> Create a monochrome SVG “Check / Completed” icon. A single checkmark with a gentle angle and rounded ends. No circle. Rounded caps/joins, stroke-only, `stroke="currentColor"`, `fill="none"`. 24x24 viewBox. Bold enough for list rows.

### 9) icon-uncheck (24x24)

**Prompt:**

> Create a monochrome SVG “Unchecked / Not completed” icon. A rounded-square outline (checkbox) with generous padding and no inner mark. Rounded caps/joins, stroke-only, `stroke="currentColor"`, `fill="none"`. 24x24 viewBox. Calm and consistent with the check icon.

### 10) icon-memo (24x24)

**Prompt:**

> Create a monochrome SVG “Memo / Note” icon. A simple note sheet with a folded corner and two short horizontal lines. Rounded caps/joins, stroke-only, `stroke="currentColor"`, `fill="none"`. 24x24 viewBox. Minimal detail, centered.

# コンポーネント規約（UI Kit / Component Spec）

> 目的：デザインと実装の“共通言語”を作る（迷い・ブレ・作り直しを減らす）

---

## 1. レイアウト/スペーシング（Tokens）

基準は 8（小さい内部要素は 4 でもOK）。  
参考：Apple HIG Layout https://developer.apple.com/design/human-interface-guidelines/layout  
参考：Android 8dp grid https://developer.android.com/design/ui/mobile/guides/layout-and-content/grids-and-units

### Spacing tokens

- `space-4` = 4
- `space-8` = 8
- `space-12` = 12（テキスト間など）
- `space-16` = 16（基本）
- `space-24` = 24（セクション間）
- `space-32` = 32（画面の大区切り）

### Corner radius

- `radius-12`（カード基本）
- `radius-999`（ピル型）

---

## 2. タイポグラフィ（Roles）

階層を固定し、全画面で同じ役割で使う。  
参考：Apple HIG Typography https://developer.apple.com/design/human-interface-guidelines/typography  
参考：Material 3 Typography https://m3.material.io/styles/typography/overview

- `Title`：画面タイトル（1行）
- `SectionTitle`：カード見出し（短い）
- `Body`：本文（最頻出）
- `Caption`：補助説明・注釈

---

## 3. 色（Roles）

※具体色コードは `docs/design/03_color_type.md` に分離してもOK（今は役割だけ固定）

- `bg`：背景
- `surface`：カード背景
- `text`：本文
- `muted`：補助文
- `primary`：主要アクション
- `danger`：破壊的アクション（基本使わない）

---

## 4. コンポーネント一覧（MVP）

### 4.1 Button

参考：Apple HIG Buttons（44x44pt）https://developer.apple.com/design/human-interface-guidelines/buttons  
参考：Material 3 Buttons https://m3.material.io/components/buttons/overview

**種類**

- `PrimaryButton`：主要CTA（1画面1つまで）
- `SecondaryButton`：補助CTA
- `TertiaryButton`：テキストボタン（弱い操作）

**規約**

- 高さ：最小タップ領域を満たす（44以上）
- ラベル：動詞で短く（例：整える / 学ぶ / 閉じる）
- 連打対策：押下後 300ms は無効化（ダブル送信防止）

**Props（案）**

- `label: string`
- `onPress: () => void`
- `variant: 'primary'|'secondary'|'tertiary'`
- `disabled?: boolean`

---

### 4.2 Card（LearnCard / CheckItemCard）

参考：Material 3 Cards https://m3.material.io/components/cards/guidelines

**規約**

- 内側余白：`space-16`
- セクション間：`space-12` or `space-16`
- 影：控えめ（原則1段）
- タップ可能なら全体がタップ領域になる

**構造（LearnCard）**

- Title（短い）
- Body（120〜220文字目安）
- Action（今日の行い：1つ）
- Night question（1問）
- Optional：出典アイコン（タップで “参考” へ）

---

### 4.3 ListItem（ログ/設定）

参考：Apple HIG Lists and tables https://developer.apple.com/design/human-interface-guidelines/lists-and-tables

**規約**

- 左：ラベル
- 右：値（時刻など） or chevron
- 行間：詰めすぎない（`space-12`）
- タップ領域：行全体

---

### 4.4 Toggle（通知ON/OFF）

参考：Apple HIG Toggles https://developer.apple.com/design/human-interface-guidelines/toggles

**規約**

- ラベルは状態ではなく意味（例：朝の通知 / 夜の通知）
- 初期値はオンボーディングで選ばせる（勝手にONにしない）

---

### 4.5 Progress（今日の進捗）

**種類**

- `DayProgress`：朝/昼/夜の3点（Dot or Step）
- `WeekBalance`：身/口/意の比率（棒 or 3列）

**規約**

- 競争を煽らない（スコア化しない）
- “できてない” を責める色にしない（Mutedで）

---

### 4.6 Modal（Paywall / 詳細説明）

参考：Apple HIG Layout（読みやすい余白）https://developer.apple.com/design/human-interface-guidelines/layout

**規約**

- 目的は1つ
- 閉じる導線は必ず用意（右上×など）
- 長文はスクロール。最初に要点3つ。

---

## 5. 画面別コンポーネント利用ルール

### Home

- `DayProgress`
- `PrimaryButton`（未完了の最重要を1つ）
- `Card`（今日の学びの要約）

### Morning

- `CheckItemCard` ×3（身/口/意）
- 最後に `PrimaryButton`（完了）

### Learn

- `LearnCard`（本

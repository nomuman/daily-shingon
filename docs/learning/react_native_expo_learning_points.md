# React / React Native / Expo 学習ポイント（ここまでの実装から・最新版）

対象：TypeScript経験あり / Expo初心者  
ゴール：通知・履歴・設定・テストなど、次の機能追加を “迷わず” 進められる状態になる

---

## 0) このプロジェクトで学ぶ地図（MECE）

### A. React（UIの考え方）

- 宣言的UI / コンポーネント / props / state
- Hooks（useState/useEffect/useMemo/useCallback）
- 再レンダリングのトリガーと依存配列の考え方

### B. React Native（モバイルUIの基礎）

- Core Components（View/Text/Pressable/TextInput/FlatList）
- StyleSheet（CSSではなくJSオブジェクト）
- 入力・アクセシビリティ・リンク

### C. Expo（開発体験とネイティブ機能）

- `expo install` とSDK管理
- expo-localization / expo-web-browser などのSDK利用

### D. Expo Router（画面構成と遷移）

- file-based routing / \_layout / Tabs
- `router.push` と `router.replace`
- RootLayout と `<Slot />` の重要性

### E. データ（保存と読み込み）

- AsyncStorage（key-value、非暗号化）
- 日付キー設計 / JSONの壊れ対策
- “画面復帰時に最新を反映” の設計（useFocusEffect）

### F. i18n（UI文言とコンテンツの多言語）

- i18next + react-i18next（useTranslation）
- expo-localization（端末ロケール）
- Metro制約（dynamic import禁止に近い）→ 静的import + マップ

### G. 品質（中級の入口）

- パフォーマンス（FlatList / メモ化）
- テスト（Jest / React Native Testing Library）
- “壊れにくい構造”（ロジック分離、型、境界）

---

## 1) Reactの基礎：UI = 関数（宣言的UI）

- Reactは **「状態（state）からUIを計算する」** という考え方。
- “命令” ではなく “宣言”：
  - ❌「このテキストを変更しろ」
  - ✅「stateがこうなら、このUIを返す」

ReactのHooks一覧と考え方は公式が一番速い。

### 1.1 props と state（最小の違い）

- props：親から渡される入力（基本は読み取り専用）
- state：コンポーネント内部の状態（useStateで更新 → 再レンダリング）

---

## 2) Hooks：このプロジェクトで使った “必須4つ”

### 2.1 useState：画面内の状態

- 例：検索文字 `q` / 選択タグ `activeTag` / ロード中 `loading`
- state更新は “再レンダリング” を引き起こす

### 2.2 useEffect：初期化・副作用

- “画面がマウントされたときに1回” は `useEffect(() => {}, [])`
- 非同期（AsyncStorage読み込み等）を起動する場所

### 2.3 useMemo：計算のメモ化（必要なときだけ）

- フィルタ結果やタグ一覧など、毎回の再計算を避けたいときに使う
- ただし **乱用しない**（まず正しく動かす → 重くなってから）

### 2.4 useCallback：関数のメモ化（依存で更新）

- `useFocusEffect` と組み合わせるときに重要（毎renderで関数が変わるのを避ける）
- `useCallback(fn, deps)` の意味は公式が明快。

---

## 3) React NativeのUI基礎：Core Components

### 3.1 Pressable：タップ可能UIの標準

- 押下を扱うコアコンポーネント。選択UI・カードUIで多用。
- `style={[base, selected && selectedStyle]}` で状態に応じて見た目を変える

### 3.2 TextInput：入力の基本

- `onChangeText` で文字列を state に流し込むのが基本。
- マルチライン等はOS差が出るので “最低限の見た目調整” を用意する（Androidの縦位置など）

### 3.3 FlatList：大量リストの標準

- 大量データは `ScrollView` ではなく `FlatList`。
- `keyExtractor` は必須級（警告や不具合回避）
- `FlatList` は PureComponent 的に最適化されるので、必要なら `extraData` を渡すことがある。

### 3.4 StyleSheet：CSSじゃない

- RNのスタイルは JSオブジェクト。命名はcamelCase。

### 3.5 アクセシビリティ：最低限でも価値が高い

- RNはアクセシビリティ用のプロパティを提供している。
- 選択状態があるUIは `accessibilityState` を付けると伝わりやすい（TalkBack/VoiceOver）

---

## 4) Expo Router：ファイル構成 = 画面構成

### 4.1 file-based routing

- `app/` 配下の構造がそのままルーティングになる。
- ディレクトリごとに `_layout.tsx` を定義できる。
- Tabsは `app/(tabs)/_layout.tsx` を中心に組む。

### 4.2 RootLayout と `<Slot />` は “絶対に最初から描画”

- Rootで `<Slot/>` や navigator を描画しないと、
  “Attempted to navigate before mounting the Root Layout component…” が起きる。
- 対策：Rootは常に `<Slot/>` を描き、ローディングは **上に重ねる**（Slotを消さない）

### 4.3 router.push / replace の使い分け

- `push`：履歴に積む（戻るが自然）
- `replace`：差し替える（保存後Homeへ戻る等）

---

## 5) “戻ったときに最新を反映” 問題（重要：モバイル特有）

### 5.1 問題

- タブ移動/画面遷移で、Homeのstateが古いまま残る
- 保存したのに表示が更新されない

### 5.2 解決：useFocusEffect

- 画面がフォーカスを受けたタイミングで effect を走らせられる。
- 注意：コールバックは `useCallback` で安定化しないと、毎renderで走りやすい。

---

## 6) 永続化：AsyncStorage（今回の土台）

### 6.1 AsyncStorageの性質

- 非同期・永続・key-value
- **暗号化されない（機密情報向きではない）**。
- React Native本体からは削除され、コミュニティ版を使うのが前提。

### 6.2 設計パターン：日付キー（超重要）

- `prefix:YYYY-MM-DD` のように日付ごとにキーを分割
- “今日のログ” が自然に日替わりし、履歴機能へ拡張しやすい

### 6.3 壊れたJSON対策

- `JSON.parse` は例外が出るので `try/catch` でクラッシュ回避
- 失敗したら `removeItem` して復旧できる設計に

### 6.4 機密データは SecureStore

- APIトークン等を保存したいなら `expo-secure-store`（暗号化）を検討。

---

## 7) i18n：UI文言（i18next / react-i18next）

### 7.1 useTranslation（Hookで購読するのが基本）

- `useTranslation` は `t` と `i18n` を取得できる。
- 言語切替は `i18n.changeLanguage`。
- “i18next直importのt” で描画すると再レンダリングされずハマることがある（Hookで購読するのが安全）。

### 7.2 expo-localization：端末ロケール

- 端末の言語/地域情報を取るためのExpo SDK。

### 7.3 AppStateで “フォアグラウンド復帰” を拾う

- OS設定で言語が変わった後、アプリ復帰で追従したい時に使う。

---

## 8) i18n：コンテンツ（cards/glossary）読み分け（重要）

### 8.1 Metroの制約：dynamic import/require は基本NG

- 変数でパスを組み立てて import/require するのは難しい。
- 今回の正攻法：
  - `*.ja.json` と `*.en.json` を **静的に import**
  - `{ ja: [...], en: [...] }` のマップで切り替える

### 8.2 JSON import と TypeScript

- `.json` を import するには `tsconfig` の `resolveJsonModule` が必要。

### 8.3 IDは言語間で固定（超重要）

- `pack_id` / `card.id` / `term.id` を同一にする
- ルーティング（URL）や詳細画面の参照が壊れない

---

## 9) 外部リンク：Linking / WebBrowser / Markdown

### 9.1 Linking

- URLを開く標準API。

### 9.2 expo-web-browser

- OSのブラウザ（SFSafariViewController/CustomTabs等）を使う。

### 9.3 Markdown表示のリンク処理

- `react-native-markdown-display` は `onLinkPress` でリンク動作を差し替え可能（Linkingへ渡すなど）。

---

## 10) パフォーマンス（中級の入口）

### 10.1 FlatListの基本最適化

- `keyExtractor`
- 必要なら `extraData`（FlatListがPureComponent的なので、propsが変わらないと再描画しない点に注意）。

### 10.2 メモ化の判断基準

- **重い計算 / 重い描画 / 関数参照が重要なHook**（useFocusEffect等）のときだけ
- `useCallback` は依存配列を正確に（バグの温床になりがち）。

---

## 11) 設計として学んだこと（このプロジェクトの核）

### 11.1 UIとロジックを分ける

- “保存/読み込み/変換” を `lib/` に寄せる
- 画面は「表示・入力・押下」に集中
- テストが書きやすくなる（次章へ）

### 11.2 “境界” を意識する

- 端末依存：expo-localization / AppState
- 永続化：AsyncStorage / SecureStore
- 画面：Expo Router
  この境界に “小さな関数” を置くと壊れにくい

---

## 12) テスト（中級の入口：最小セット）

### 12.1 ExpoのJest（jest-expo）

- Expoは公式でJestのガイドを出している。

### 12.2 React Native Testing Library（RNTL）

- “ユーザーが使うようにテストする” という思想が基本。
- RN公式もテストの概観を提供。

---

## 13) セルフチェック（0→中級）

### Level 0（用語・構造）

- [ ] `app/` のファイル構造で、目的の画面がどこにあるか説明できる
- [ ] `View/Text/Pressable/TextInput/FlatList` を用途で使い分けられる

### Level 1（Hooks）

- [ ] useState/useEffect を “何のために” 使うか説明できる
- [ ] useMemo/useCallback を “必要な場面だけ” 使える

### Level 2（モバイルらしさ）

- [ ] useFocusEffect でフォーカス時再読込できる
- [ ] AsyncStorageで日付キー保存できる（暗号化されない点も理解）

### Level 3（中級入口）

- [ ] RootLayoutでSlotを消さずにローディングを重ねられる
- [ ] UI文言とコンテンツのi18nを分けて設計できる（静的import + マップ）
- [ ] Jest/RNTLで “保存ロジック” と “画面” を別々にテストする設計ができる

---

## 参考リンク（公式中心・コピペ用）

React

- https://react.dev/reference/react/hooks
- https://react.dev/reference/react/useCallback

React Native

- https://reactnative.dev/docs/pressable
- https://reactnative.dev/docs/textinput
- https://reactnative.dev/docs/flatlist
- https://reactnative.dev/docs/stylesheet
- https://reactnative.dev/docs/accessibility
- https://reactnative.dev/docs/appstate
- https://reactnative.dev/docs/linking

Expo / Expo Router

- https://docs.expo.dev/versions/latest/sdk/router/
- https://docs.expo.dev/router/basics/layout/
- https://docs.expo.dev/router/advanced/tabs/
- https://docs.expo.dev/router/advanced/authentication-rewrites/
- https://docs.expo.dev/versions/latest/sdk/async-storage/
- https://docs.expo.dev/develop/user-interface/store-data/
- https://docs.expo.dev/versions/latest/sdk/securestore/
- https://docs.expo.dev/versions/latest/sdk/localization/
- https://docs.expo.dev/versions/latest/sdk/webbrowser/

React Navigation

- https://reactnavigation.org/docs/use-focus-effect/

i18n

- https://react.i18next.com/guides/quick-start
- https://react.i18next.com/latest/usetranslation-hook

TypeScript

- https://www.typescriptlang.org/tsconfig/resolveJsonModule.html

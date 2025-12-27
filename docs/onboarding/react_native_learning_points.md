# React / React Native 学習ポイント（ここまでの実装から）
対象：TypeScript経験あり / Expo初心者  
ゴール：今後の実装（通知・履歴・設定・テスト）を迷わず進めるための“要点まとめ”

---

## 1) コンポーネントの考え方（UI = 関数）
- 画面は「関数コンポーネント」で作る
- `return (...)` がUI
- UIは「stateが変わる → 再レンダリング → 見た目が更新」の流れ

---

## 2) Hooksの基礎（今回使ったやつ）
### useState：画面内の状態
- 例：`selected` / `loading` / `note` / `morningDone` など
- 「今の画面がどういう状態か」を持つ

### useEffect：最初の読み込み（初期化）
- 例：画面を開いたときに
  - 今日のカードを読み込む
  - AsyncStorageから復元する
- “マウント時に一回”は `useEffect(() => { ... }, [])`

### useMemo：計算結果をキャッシュ（必要なときだけ）
- 例：`complete` 判定（朝3つ全部trueか）を再計算しすぎない
- 「重い計算」や「依存が明確な計算」の整理に向く :contentReference[oaicite:0]{index=0}

### useCallback：関数をキャッシュ（依存が変わると更新）
- 例：`refresh` を focus ごとに呼びたいとき
- `useFocusEffect` と合わせるときは特に重要（毎renderで関数が変わるのを避ける） :contentReference[oaicite:1]{index=1}

---

## 3) 画面遷移（Expo Router）
- `app/` 配下のファイル構造がそのままルートになる（file-based routing）
- `(tabs)/_layout.tsx` がTabs構成の中心
- タブを増やす＝`app/(tabs)/xxx.tsx` を作って Tabs に追加 :contentReference[oaicite:2]{index=2}

### routerの使い分け
- `router.push('/night')`：履歴として積む（戻るで戻れる）
- `router.replace('/')`：画面を差し替える（保存後にHomeへ戻すときに便利）

---

## 4) 「戻ったときに最新を反映」問題と解決（useFocusEffect）
タブ移動/画面遷移でよく起きる問題：
- Homeのstateが古いまま残る
- さっき保存したのに表示が更新されない

解決：
- Homeで `useFocusEffect(() => refresh())` を使って「フォーカスされたら再読み込み」する :contentReference[oaicite:3]{index=3}

---

## 5) 永続化（AsyncStorage）— “今日”のデータを保存する設計
### AsyncStorageの基本
- **key-value**（文字列）で保存する
- オブジェクトは `JSON.stringify` / `JSON.parse` が基本 :contentReference[oaicite:4]{index=4}
- 機密データ向きではない（暗号化されない） :contentReference[oaicite:5]{index=5}

### 今回の設計パターン（超重要）
- 日付ごとにキーを分ける：例 `morningLog:YYYY-MM-DD`
- こうすると「今日のログ」が自然に日替わりし、履歴機能にも拡張しやすい

### 壊れたJSON対策
- `try/catch` してパース失敗したら `removeItem` で消す（クラッシュ回避）

---

## 6) UIの実装パターン（今回の定番）
### Pressable：タップできるUI
- “選択カード”に最適
- `style={[base, selected && selectedStyle]}` で状態に応じて見た目を変える :contentReference[oaicite:6]{index=6}

### 条件レンダリング
- `loading` のときは `ActivityIndicator` を出す
- データがない場合のフォールバックUIも用意する

---

## 7) 入力（TextInput）でハマるポイント
- `multiline` のTextInputは、Androidで縦中央に見えることがある  
  → `textAlignVertical: 'top'` を付けると揃う :contentReference[oaicite:7]{index=7}

---

## 8) アクセシビリティ（最低限でOK）
- 選択状態のあるUI（3択など）は `accessibilityState={{ selected: true/false }}` を付ける  
  → 読み上げで状態が伝わる :contentReference[oaicite:8]{index=8}

---

## 9) “設計として学んだこと”（Reactに効く）
### 9.1 画面（UI）と保存ロジックを分ける
- `src/lib/xxxxLog.ts` に保存/取得/判定を寄せた
- 画面側は「表示・入力・ボタン押下」に集中できる
- テストも書きやすくなる（ロジックTDDがしやすい）

### 9.2 「状態は単純に」
- boolean 3つ＋メモ、みたいに分解するとUIが楽
- 完了判定は `isMorningComplete` のように関数化して再利用

---

## 10) 次に進む前の “確認チェック”（セルフテスト）
- [ ] `useState / useEffect` の役割を説明できる
- [ ] `useMemo / useCallback` を「必要な場面だけ」使える :contentReference[oaicite:9]{index=9}
- [ ] `useFocusEffect` で再読み込みのタイミングを作れる :contentReference[oaicite:10]{index=10}
- [ ] AsyncStorageで「日付キー」保存ができる :contentReference[oaicite:11]{index=11}
- [ ] Expo RouterのTabs追加ができる :contentReference[oaicite:12]{index=12}
- [ ] Pressableで選択UIを作れる :contentReference[oaicite:13]{index=13}
- [ ] multiline TextInput の上揃えを直せる :contentReference[oaicite:14]{index=14}

---

## 参考（公式ドキュメント中心）
※URLはコピペ用

```txt
React Hooks（公式）
https://react.dev/reference/react/hooks
useCallback（公式）
https://react.dev/reference/react/useCallback

Pressable（React Native公式）
https://reactnative.dev/docs/pressable
Accessibility / accessibilityState（React Native公式）
https://reactnative.dev/docs/accessibility
TextInput（multiline / textAlignVertical）（React Native公式）
https://reactnative.dev/docs/textinput

useFocusEffect（React Navigation公式）
https://reactnavigation.org/docs/use-focus-effect/

Expo Router Tabs（公式）
https://docs.expo.dev/router/advanced/tabs/
Expo Router Layout（_layout.tsx）（公式）
https://docs.expo.dev/router/basics/layout/

AsyncStorage（Expo SDK公式）
https://docs.expo.dev/versions/latest/sdk/async-storage/
Expo: Store data（公式ガイド）
https://docs.expo.dev/develop/user-interface/store-data/

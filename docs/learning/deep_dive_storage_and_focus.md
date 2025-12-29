# Deep Dive: 保存（AsyncStorage）と “戻ったら最新” 問題

## 1) AsyncStorageの性質（まず暗記）

- key-value / 永続 / 非同期
- **暗号化されない**（機密情報には不向き） :contentReference[oaicite:47]{index=47}
- RN本体からは削除（コミュニティ版を使う） :contentReference[oaicite:48]{index=48}

## 2) 設計：日付キーが最強

例：`morningLog:YYYY-MM-DD`

- “今日” が自然に切り替わる
- 履歴機能へ伸ばしやすい

## 3) JSONの壊れ対策は必須

- parseは try/catch
- 壊れてたら removeItem して復旧（クラッシュ防止）

## 4) 画面復帰時に最新を反映する（useFocusEffect）

- useFocusEffectは “画面がフォーカスされた時” に走る :contentReference[oaicite:49]{index=49}
- callbackはuseCallbackで安定化（依存配列が壊れると地獄） :contentReference[oaicite:50]{index=50}

# Deep Dive: i18n（UI文言 + コンテンツ）設計

## 1) 2種類のi18nを分ける

### 1.1 UI文言（ボタン/ラベル/設定）

- i18next + react-i18next
- useTranslationで購読（言語変更 → 再レンダリング）

### 1.2 コンテンツ（cards/glossary）

- JSONがソース・バージョン管理しやすい
- “表示言語” に応じて `*.ja.json` / `*.en.json` を切り替える

## 2) expo-localization と端末追従

- 端末ロケール情報は expo-localization。
- system追従したい場合、フォアグラウンド復帰で再評価が必要になることがあるので AppState を併用。

## 3) Metro制約：dynamic importは避ける

- 変数でimport/requireすると解決できないケースが多い。
- 正攻法：静的import + `Record<Lang, Resource>` のマップ

## 4) JSON import と tsconfig

- JSON importは `resolveJsonModule` が必要。

## 5) “ID固定” がルーティングを守る

- pack_id / card.id / term.id を言語間で一致
- これができてないと、URLや詳細画面参照が壊れる（地味に致命的）

## 6) よくある落とし穴

- i18nextを直importして `t()` だけ使う → 画面が切り替わらない  
  → useTranslationで購読する

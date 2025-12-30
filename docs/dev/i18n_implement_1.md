# i18n 実装テンプレ（Expo Router + TypeScript）— 日英＋言語切替＋永続化

対象：ジュニアエンジニア（Expo初挑戦 / TS経験あり）  
目的：「まいにち真言（JP） / Daily Shingon（EN）」を **日英対応**し、**設定画面で言語切替**できて、**次回起動後も保持**される状態にする。

推奨スタック：

- ロケール取得：`expo-localization`（Expo公式。Androidは復帰時に再取得推奨）
- 翻訳：`i18next` + `react-i18next`（React向けの定番）
- 永続化：`@react-native-async-storage/async-storage`（Expo公式の導入手順あり）
- Router：Expo Router（`_layout.tsx` が最上流。常に navigator/Slot を描画するのが重要）

---

## 1) インストール

```bash
npm i i18next react-i18next
npx expo install expo-localization
npx expo install @react-native-async-storage/async-storage
```

````

AsyncStorage の導入は Expo ドキュメント通り。([Expo Documentation][1])

---

## 2) 追加するファイル構成

```
locales/
  ja/common.json
  en/common.json

lib/i18n/
  detectLocale.ts
  storage.ts
  index.ts

app/(tabs)/settings/index.tsx
```

> `settings` タブが無い場合は、既存の設定画面の場所にこの `index.tsx` を置き換えてOK。

---

## 3) 翻訳ファイル（最小セット）

### `locales/ja/common.json`

```json
{
  "app": {
    "name": "まいにち真言"
  },
  "nav": {
    "learn": "学び",
    "settings": "設定"
  },
  "settings": {
    "title": "設定",
    "language": "言語",
    "languageDescription": "アプリで表示する言語を選びます。",
    "system": "端末の設定に従う",
    "japanese": "日本語",
    "english": "英語",
    "restartNote": "一部の表示は画面を開き直すと反映されます。"
  }
}
```

### `locales/en/common.json`

```json
{
  "app": {
    "name": "Daily Shingon"
  },
  "nav": {
    "learn": "Learn",
    "settings": "Settings"
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "languageDescription": "Choose the language used in the app.",
    "system": "Follow device language",
    "japanese": "Japanese",
    "english": "English",
    "restartNote": "Some screens may update after reopening."
  }
}
```

---

## 4) i18n 実装（全量）

### `lib/i18n/storage.ts`

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageCode = 'ja' | 'en';
export type LanguagePreference = 'system' | LanguageCode;

const KEY = 'i18n.languagePreference.v1';

export async function loadLanguagePreference(): Promise<LanguagePreference> {
  const v = await AsyncStorage.getItem(KEY);
  if (v === 'ja' || v === 'en' || v === 'system') return v;
  return 'system';
}

export async function saveLanguagePreference(pref: LanguagePreference) {
  await AsyncStorage.setItem(KEY, pref);
}
```

### `lib/i18n/detectLocale.ts`

```ts
import * as Localization from 'expo-localization';
import type { LanguageCode } from './storage';

/**
 * 端末ロケールを見て、サポート対象（ja/en）に丸める。
 * Expo docs: Androidはアプリ復帰時に getLocales() を取り直す推奨
 */
export function detectDeviceLanguage(): LanguageCode {
  const locales = Localization.getLocales();
  const first = locales?.[0];

  const lang = (first?.languageCode?.toLowerCase() ?? '').split('-')[0].trim();

  if (lang === 'ja') return 'ja';
  return 'en';
}
```

### `lib/i18n/index.ts`

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AppState } from 'react-native';

import type { LanguageCode, LanguagePreference } from './storage';
import { loadLanguagePreference, saveLanguagePreference } from './storage';
import { detectDeviceLanguage } from './detectLocale';

// 翻訳リソース（最小：common）
import jaCommon from '../../locales/ja/common.json';
import enCommon from '../../locales/en/common.json';

export const SUPPORTED_LANGUAGES: LanguageCode[] = ['ja', 'en'];

const resources = {
  ja: { common: jaCommon },
  en: { common: enCommon },
} as const;

let currentPref: LanguagePreference = 'system';

/**
 * i18n 初期化（Rootで1回だけ呼ぶ）
 * react-i18next の初期化は initReactI18next を use。
 */
export async function initI18n() {
  currentPref = await loadLanguagePreference();
  const lang = currentPref === 'system' ? detectDeviceLanguage() : currentPref;

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: lang,
      fallbackLng: 'en',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
    });
  } else {
    await i18n.changeLanguage(lang);
  }

  // Androidでは端末言語がアプリ起動中に変わり得るので、
  // 「system」選択時のみ、フォアグラウンド復帰で追従する。
  attachForegroundLocaleSync();
}

export function getI18n() {
  return i18n;
}

/**
 * 設定画面から呼ぶ：言語を変更して永続化する
 */
export async function setLanguagePreference(pref: LanguagePreference) {
  currentPref = pref;
  await saveLanguagePreference(pref);

  const lang = pref === 'system' ? detectDeviceLanguage() : pref;
  await i18n.changeLanguage(lang);
}

export async function getLanguagePreference(): Promise<LanguagePreference> {
  currentPref = await loadLanguagePreference();
  return currentPref;
}

/**
 * 端末言語に追従（system のときだけ）
 */
async function syncWithDeviceIfNeeded() {
  if (currentPref !== 'system') return;
  const lang = detectDeviceLanguage();
  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }
}

/**
 * フォアグラウンド復帰でロケール再取得
 * Expo docs: Androidは復帰のたびに getLocales() を再取得推奨
 */
let attached = false;
function attachForegroundLocaleSync() {
  if (attached) return;
  attached = true;

  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      // fire and forget（失敗してもUIは生きる）
      syncWithDeviceIfNeeded();
    }
  });
}
```

---

## 5) Root で i18n を初期化する（重要）

Expo Router は `_layout.tsx` が上流レイアウト。ここで **1回だけ** `initI18n()` を呼ぶ。
また、Root では **常に navigator/Slot を描画**する（条件分岐で消すと “Root Layout 未マウント” エラーの原因になり得る）。([Expo Documentation][2])

あなたのプロジェクトの `app/_layout.tsx` に、以下のような初期化を追加してください（既存の構造は維持してOK）。

### 例：`app/_layout.tsx` の先頭で init（差分例）

```tsx
import React, { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { initI18n } from '../lib/i18n';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    initI18n()
      .then(() => mounted && setReady(true))
      .catch(() => mounted && setReady(true)); // 失敗しても起動は継続
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Slot />
      {!ready && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </>
  );
}
```

> ポイント：`<Slot />` を常に描画したまま、上からローディングを重ねる。

---

## 6) 設定画面：言語切替 UI（全量）

### `app/(tabs)/settings/index.tsx`

```tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { LanguagePreference } from '../../../lib/i18n/storage';
import { getLanguagePreference, setLanguagePreference } from '../../../lib/i18n';

type Option = {
  value: LanguagePreference;
  labelKey: string;
};

export default function SettingsScreen() {
  const { t } = useTranslation('common');
  const [pref, setPref] = useState<LanguagePreference>('system');

  const options: Option[] = useMemo(
    () => [
      { value: 'system', labelKey: 'settings.system' },
      { value: 'ja', labelKey: 'settings.japanese' },
      { value: 'en', labelKey: 'settings.english' },
    ],
    [],
  );

  useEffect(() => {
    getLanguagePreference().then(setPref);
  }, []);

  const onSelect = async (v: LanguagePreference) => {
    setPref(v); // 先にUI反映
    await setLanguagePreference(v); // 永続化＋i18n反映
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <Text style={styles.sectionDesc}>{t('settings.languageDescription')}</Text>

        <View style={styles.card}>
          {options.map((o) => (
            <Pressable key={o.value} onPress={() => onSelect(o.value)} style={styles.row}>
              <View style={styles.radioOuter}>
                {pref === o.value ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.rowText}>{t(o.labelKey)}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.note}>{t('settings.restartNote')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  title: { fontSize: 24, fontWeight: '800', marginTop: 8 },

  section: { marginTop: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  sectionDesc: { marginTop: 6, opacity: 0.7 },

  card: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  rowText: { fontSize: 16 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  note: { marginTop: 10, opacity: 0.7 },
});
```

---

## 7) 各画面で翻訳を使う（例）

`react-i18next` の `useTranslation` で `t()` を呼ぶ。([React i18next][3])

### 例：任意の画面（Learnなど）

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('common');
<Text>{t('app.name')}</Text>;
```

---

## 8) 動作チェックリスト（PRレビュー用）

- [ ] 初回起動で端末言語に応じて ja/en が選ばれる（system）
- [ ] 設定で `日本語 / 英語 / 端末に従う` を切り替えられる
- [ ] アプリ再起動後も選択が保持される（AsyncStorage）([Expo Documentation][1])
- [ ] Androidで端末言語を変えた後、アプリ復帰時に system 選択なら追従する（AppState + getLocales再取得）([Expo Documentation][4])
- [ ] RootLayout は常に `<Slot />` を描画している（Root未マウント系エラー回避）([Expo Documentation][5])

---

## 9) 次にやると良い改善（任意）

- 翻訳ファイルを `common/learn/settings` のように名前空間分割して増やす
- 未翻訳検知（キーが無い時のログを dev だけ出す）
- コンテンツJSON（cards/glossary）も `*.ja.json` / `*.en.json` の同一スキーマで揃える

```


[1]: https://docs.expo.dev/versions/latest/sdk/async-storage/?utm_source=chatgpt.com '@react-native-async-storage/async-storage'
[2]: https://docs.expo.dev/router/basics/layout/?utm_source=chatgpt.com 'Navigation layouts in Expo Router'
[3]: https://react.i18next.com/latest/usetranslation-hook?utm_source=chatgpt.com 'useTranslation (hook)'
[4]: https://docs.expo.dev/versions/latest/sdk/localization/?utm_source=chatgpt.com 'Localization'
[5]: https://docs.expo.dev/router/advanced/authentication-rewrites/?utm_source=chatgpt.com 'Authentication in Expo Router using redirects'
```
````

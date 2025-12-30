# コンテンツi18n（学びカード / 用語集）実装テンプレ

目的：`content/**/*.ja.json` と `content/**/*.en.json` を **言語に応じて自動で読み分け**、画面も言語変更に追従させる。

前提：

- UI文言は i18next/react-i18next で日英対応済み
- JSON import ができるよう `tsconfig.json` で `resolveJsonModule: true` 済み（未設定なら必須）

---

## 0) 重要な制約（React Native / Metro）

Metro は **変数でパスを組み立てた dynamic require/import を基本的に解決できない**ので、
`require(\`./${lang}/file.json\`)` みたいな実装は避ける。  
→ **言語ごとに静的 import して、マップで切り替える**のが安全。

---

## 1) ファイル命名規則（必須）

カードパック（例）：

- `content/cards/00_core.ja.json`
- `content/cards/00_core.en.json`
- `content/cards/01_people.ja.json`
- `content/cards/01_people.en.json`
  …（以下同様）

用語集：

- `content/glossary/glossary.ja.json`
- `content/glossary/glossary.en.json`

**超重要**：

- `pack_id` / `card.id` / `glossary entry.id` は **言語間で同一**にする（詳細画面のURLが壊れないため）

---

## 2) 追加・変更するファイル一覧

追加：

- `lib/content/lang.ts`
- `lib/content/useContentLang.ts`

変更：

- `lib/content/cards.ts`
- `lib/content/glossary.ts`

変更（画面側：言語を渡すようにする）

- `app/(tabs)/learn/cards/index.tsx`
- `app/(tabs)/learn/cards/[packId].tsx`
- `app/(tabs)/learn/cards/[packId]/[cardId].tsx`
- `app/(tabs)/learn/glossary/index.tsx`
- `app/(tabs)/learn/glossary/[termId].tsx`

---

## 3) 実装（全量コピペ）

### 3.1 `lib/content/lang.ts`（新規）

```ts
export type ContentLang = 'ja' | 'en';

/**
 * i18n.language は "en" だけでなく "en-US" のような形式もあるので正規化する。
 */
export function normalizeContentLang(lng?: string): ContentLang {
  const base = (lng ?? 'en').split('-')[0].toLowerCase();
  return base === 'ja' ? 'ja' : 'en';
}
```

---

### 3.2 `lib/content/useContentLang.ts`（新規）

```ts
import { useTranslation } from 'react-i18next';
import { normalizeContentLang, type ContentLang } from './lang';

/**
 * useTranslation() は言語変更で再レンダーされるため、
 * ここで current language を購読してコンテンツも追従させる。
 * （react-i18next の hook 利用が基本）
 */
export function useContentLang(): ContentLang {
  const { i18n } = useTranslation(); // これで language 変更に追従
  return normalizeContentLang(i18n.language);
}
```

---

### 3.3 `lib/content/cards.ts`（差し替え全量）

```ts
import type { CardPackJson } from './types';
import type { ContentLang } from './lang';

// ✅ ja
import coreJa from '../../content/cards/00_core.ja.json';
import peopleJa from '../../content/cards/01_people.ja.json';
import practiceJa from '../../content/cards/02_practice.ja.json';
import mandalaJa from '../../content/cards/03_mandala.ja.json';
import textsJa from '../../content/cards/04_texts.ja.json';
import uxJa from '../../content/cards/05_app_integration.ja.json';

// ✅ en（用意していない場合は、まずファイルを作る）
import coreEn from '../../content/cards/00_core.en.json';
import peopleEn from '../../content/cards/01_people.en.json';
import practiceEn from '../../content/cards/02_practice.en.json';
import mandalaEn from '../../content/cards/03_mandala.en.json';
import textsEn from '../../content/cards/04_texts.en.json';
import uxEn from '../../content/cards/05_app_integration.en.json';

// Metroの制約上、ここは “静的 import + マップ切替” が安全
const PACKS_BY_LANG: Record<ContentLang, CardPackJson[]> = {
  ja: [coreJa, peopleJa, practiceJa, mandalaJa, textsJa, uxJa] as unknown as CardPackJson[],
  en: [coreEn, peopleEn, practiceEn, mandalaEn, textsEn, uxEn] as unknown as CardPackJson[],
};

export type CardPackSummary = {
  packId: string;
  title: string;
  description?: string;
  count: number;
};

export function getCardPacks(lang: ContentLang): CardPackSummary[] {
  return PACKS_BY_LANG[lang].map((p) => ({
    packId: p.meta.pack_id,
    title: p.meta.title,
    description: p.meta.description,
    count: p.cards.length,
  }));
}

export function getPackById(lang: ContentLang, packId: string): CardPackJson | undefined {
  return PACKS_BY_LANG[lang].find((p) => p.meta.pack_id === packId);
}

export function getCardById(lang: ContentLang, packId: string, cardId: string) {
  const pack = getPackById(lang, packId);
  const card = pack?.cards.find((c) => c.id === cardId);
  return { pack, card };
}
```

---

### 3.4 `lib/content/glossary.ts`（差し替え全量）

```ts
import type { GlossaryEntry, GlossaryJson } from './types';
import type { ContentLang } from './lang';

import glossaryJa from '../../content/glossary/glossary.ja.json';
import glossaryEn from '../../content/glossary/glossary.en.json';

const GLOSSARY_BY_LANG: Record<ContentLang, GlossaryJson> = {
  ja: glossaryJa as unknown as GlossaryJson,
  en: glossaryEn as unknown as GlossaryJson,
};

export function getGlossary(lang: ContentLang): GlossaryJson {
  return GLOSSARY_BY_LANG[lang];
}

export function getGlossaryEntry(lang: ContentLang, termId: string): GlossaryEntry | undefined {
  return GLOSSARY_BY_LANG[lang].entries.find((e) => e.id === termId);
}
```

---

## 4) 画面側の変更（言語を渡す）

> ここでは `useContentLang()` を使って、言語変更に自動追従させる。
> react-i18next の hook は language change で再レンダーされる（挙動の議論もあるが、少なくとも購読用途で使える）。 ([React i18next][1])

---

### 4.1 `app/(tabs)/learn/cards/index.tsx`（差し替え全量）

```tsx
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { getCardPacks } from '../../../lib/content/cards';
import { useContentLang } from '../../../lib/content/useContentLang';

export default function CardPackListScreen() {
  const lang = useContentLang();
  const packs = getCardPacks(lang);

  return (
    <View style={styles.container}>
      <FlatList
        data={packs}
        keyExtractor={(item) => item.packId}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => router.push(`/learn/cards/${item.packId}`)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>
              {item.count} cards {item.description ? `・${item.description}` : ''}
            </Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  item: { paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { marginTop: 6, opacity: 0.7 },
  sep: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
});
```

---

### 4.2 `app/(tabs)/learn/cards/[packId].tsx`（差し替え全量）

```tsx
import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getPackById } from '../../../lib/content/cards';
import type { Card } from '../../../lib/content/types';
import { SearchInput } from '../../../components/SearchInput';
import { TagRow } from '../../../components/TagRow';
import { useContentLang } from '../../../lib/content/useContentLang';

export default function CardListScreen() {
  const lang = useContentLang();
  const { packId } = useLocalSearchParams<{ packId: string }>();
  const pack = getPackById(lang, packId);

  const [q, setQ] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    if (!pack) return [];
    return pack.cards.flatMap((c) => c.tags ?? []);
  }, [pack]);

  const filtered = useMemo(() => {
    if (!pack) return [];
    const query = q.trim().toLowerCase();

    return pack.cards.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query) ||
        c.summary.toLowerCase().includes(query) ||
        (c.tags ?? []).some((t) => t.toLowerCase().includes(query));

      const matchesTag = !activeTag || (c.tags ?? []).includes(activeTag);

      return matchesQuery && matchesTag;
    });
  }, [pack, q, activeTag]);

  if (!pack) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 16 }}>packId not found: {packId}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchInput value={q} onChangeText={setQ} placeholder="Search cards" />
      <TagRow tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardRow
            card={item}
            onPress={() => router.push(`/learn/cards/${pack.meta.pack_id}/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

function CardRow({ card, onPress }: { card: Card; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowTitle}>{card.title}</Text>
      <Text style={styles.rowMeta}>
        {card.type === 'learn' ? 'Learn' : 'Practice'} ・ {card.level}
      </Text>
      <Text style={styles.rowSummary} numberOfLines={2}>
        {card.summary}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  row: { paddingHorizontal: 16, paddingVertical: 14 },
  rowTitle: { fontSize: 16, fontWeight: '700' },
  rowMeta: { marginTop: 6, opacity: 0.7 },
  rowSummary: { marginTop: 6, opacity: 0.85 },
  sep: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
});
```

---

### 4.3 `app/(tabs)/learn/cards/[packId]/[cardId].tsx`（差し替えの要点）

> ここは既存の詳細画面で `getCardById(packId, cardId)` を呼んでいたはずなので、引数に `lang` を足すだけ。

```tsx
import { useContentLang } from '../../../../lib/content/useContentLang';
import { getCardById } from '../../../../lib/content/cards';

// ...
const lang = useContentLang();
const { pack, card } = getCardById(lang, packId, cardId);
// ...
```

（全文差し替えが必要なら言って。いまのファイルにこの差分を当てればOK）

---

### 4.4 `app/(tabs)/learn/glossary/index.tsx`（差し替え全量）

```tsx
import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { getGlossary } from '../../../lib/content/glossary';
import { SearchInput } from '../../../components/SearchInput';
import { TagRow } from '../../../components/TagRow';
import { useContentLang } from '../../../lib/content/useContentLang';

export default function GlossaryListScreen() {
  const lang = useContentLang();
  const glossary = getGlossary(lang);

  const [q, setQ] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const fromTaxonomy = glossary.taxonomy?.categories ?? [];
    if (fromTaxonomy.length) return fromTaxonomy;
    return Array.from(new Set(glossary.entries.map((e) => e.category).filter(Boolean))) as string[];
  }, [glossary]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return glossary.entries.filter((e) => {
      const matchesQuery =
        !query ||
        e.term.toLowerCase().includes(query) ||
        (e.reading ?? '').toLowerCase().includes(query) ||
        e.short.toLowerCase().includes(query) ||
        e.definition.toLowerCase().includes(query);

      const matchesCategory = !activeCategory || e.category === activeCategory;

      return matchesQuery && matchesCategory;
    });
  }, [glossary, q, activeCategory]);

  return (
    <View style={styles.container}>
      <SearchInput value={q} onChangeText={setQ} placeholder="Search terms" />
      <TagRow tags={categories} activeTag={activeCategory} onSelect={setActiveCategory} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => router.push(`/learn/glossary/${item.id}`)}>
            <Text style={styles.term}>{item.term}</Text>
            <Text style={styles.meta}>
              {item.reading ? `${item.reading} ・ ` : ''}
              {item.category ?? ''}
            </Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.short}
            </Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  row: { paddingHorizontal: 16, paddingVertical: 14 },
  term: { fontSize: 16, fontWeight: '800' },
  meta: { marginTop: 6, opacity: 0.7 },
  desc: { marginTop: 6, opacity: 0.9 },
  sep: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
});
```

---

### 4.5 `app/(tabs)/learn/glossary/[termId].tsx`（差し替えの要点）

```tsx
import { useContentLang } from '../../../lib/content/useContentLang';
import { getGlossary, getGlossaryEntry } from '../../../lib/content/glossary';

// ...
const lang = useContentLang();
const glossary = getGlossary(lang);
const entry = getGlossaryEntry(lang, termId);
// ...
```

---

## 5) 動作チェックリスト（PRレビュー用）

- [ ] `ja` / `en` でカードパックのタイトルとカード本文が切り替わる
- [ ] `ja` / `en` で用語集の term/definition が切り替わる
- [ ] 設定画面で言語を変えた直後に Learn 画面が追従する（useContentLang で再レンダー）
- [ ] `pack_id` / `card.id` / `entry.id` は言語間で一致している（URLが壊れない）
- [ ] dynamic require/import を使っていない（Metroで事故りやすい） ([GitHub][2])

---

## 6) 次の改善（任意だけど強い）

- JAコンテンツが未作成の間は **fallback**（jaが無ければenを表示）を入れる
- 画面の “Learn/Practice” などのラベルも `t()` に寄せて完全ローカライズ（いまは簡易で直書き）

[1]: https://react.i18next.com/latest/usetranslation-hook?utm_source=chatgpt.com 'useTranslation (hook)'
[2]: https://github.com/facebook/metro/issues/52?utm_source=chatgpt.com 'Dynamic import not working · Issue #52 · facebook/metro'

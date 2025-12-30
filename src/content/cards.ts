/**
 * Purpose: Card pack registry and lookup utilities. / 目的: カードパックの登録と検索ユーティリティ。
 * Responsibilities: map language to packs, expose summaries, and fetch packs/cards by ID. / 役割: 言語→パックの対応、概要一覧、ID検索。
 * Inputs: raw card pack JSON, language code, pack/card IDs. / 入力: 生JSON、言語コード、パック/カードID。
 * Outputs: pack summaries and specific card data. / 出力: パック概要と個別カード。
 * Dependencies: content JSON modules and types. / 依存: コンテンツJSONモジュールと型。
 * Side effects: none. / 副作用: なし。
 * Edge cases: unknown lang/pack/card IDs return undefined or fall back to ja. / 例外: 不明言語/IDはundefinedまたはjaにフォールバック。
 */
import type { CardPackJson } from './types';
import type { ContentLang } from './lang';

import coreJa from '../../content/cards/00_core.ja.json';
import coreEn from '../../content/cards/00_core.en.json';
import peopleJa from '../../content/cards/01_people.ja.json';
import peopleEn from '../../content/cards/01_people.en.json';
import practiceJa from '../../content/cards/02_practice.ja.json';
import practiceEn from '../../content/cards/02_practice.en.json';
import mandalaJa from '../../content/cards/03_mandala.ja.json';
import mandalaEn from '../../content/cards/03_mandala.en.json';
import textsJa from '../../content/cards/04_texts.ja.json';
import textsEn from '../../content/cards/04_texts.en.json';
import uxJa from '../../content/cards/05_app_integration.ja.json';
import uxEn from '../../content/cards/05_app_integration.en.json';

// Static registry of packs per language. / 言語別パックの静的レジストリ。
const PACKS_BY_LANG: Record<ContentLang, CardPackJson[]> = {
  ja: [coreJa, peopleJa, practiceJa, mandalaJa, textsJa, uxJa],
  en: [coreEn, peopleEn, practiceEn, mandalaEn, textsEn, uxEn],
};

export type CardPackSummary = {
  packId: string;
  title: string;
  description?: string;
  count: number;
};

// Return lightweight summaries for list screens. / 一覧表示用の軽量サマリー。
export function getCardPacks(lang: ContentLang = 'ja'): CardPackSummary[] {
  const packs = PACKS_BY_LANG[lang] ?? PACKS_BY_LANG.ja;
  return packs.map((p) => ({
    packId: p.meta.pack_id,
    title: p.meta.title,
    description: p.meta.description,
    count: p.cards.length,
  }));
}

// Overload: default language when only packId is provided. / packIdのみの場合は既定言語を使用。
export function getPackById(packId: string): CardPackJson | undefined;
export function getPackById(lang: ContentLang, packId: string): CardPackJson | undefined;
export function getPackById(
  langOrPackId: ContentLang | string,
  maybePackId?: string,
): CardPackJson | undefined {
  const lang = maybePackId ? (langOrPackId as ContentLang) : 'ja';
  const packId = maybePackId ?? (langOrPackId as string);
  const packs = PACKS_BY_LANG[lang] ?? PACKS_BY_LANG.ja;
  return packs.find((p) => p.meta.pack_id === packId);
}

// Overload: default language when only packId/cardId are provided. / packId/cardIdのみなら既定言語。
export function getCardById(packId: string, cardId: string): {
  pack?: CardPackJson;
  card?: CardPackJson['cards'][number];
};
export function getCardById(lang: ContentLang, packId: string, cardId: string): {
  pack?: CardPackJson;
  card?: CardPackJson['cards'][number];
};
export function getCardById(
  langOrPackId: ContentLang | string,
  packIdOrCardId: string,
  maybeCardId?: string,
) {
  const lang = maybeCardId ? (langOrPackId as ContentLang) : 'ja';
  const packId = maybeCardId ? packIdOrCardId : (langOrPackId as string);
  const cardId = maybeCardId ?? packIdOrCardId;
  const pack = getPackById(lang, packId);
  const card = pack?.cards.find((c) => c.id === cardId);
  return { pack, card };
}

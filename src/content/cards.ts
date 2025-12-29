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

const PACKS_BY_LANG: Record<ContentLang, CardPackJson[]> = {
  ja: [coreJa, peopleJa, practiceJa, mandalaJa, textsJa, uxJa] as CardPackJson[],
  en: [coreEn, peopleEn, practiceEn, mandalaEn, textsEn, uxEn] as CardPackJson[],
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

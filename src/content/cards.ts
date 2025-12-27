import type { CardPackJson } from './types';

import core from '../../content/cards/00_core.ja.json';
import people from '../../content/cards/01_people.ja.json';
import practice from '../../content/cards/02_practice.ja.json';
import mandala from '../../content/cards/03_mandala.ja.json';
import texts from '../../content/cards/04_texts.ja.json';
import ux from '../../content/cards/05_app_integration.ja.json';

const PACKS = [core, people, practice, mandala, texts, ux] as CardPackJson[];

export type CardPackSummary = {
  packId: string;
  title: string;
  description?: string;
  count: number;
};

export function getCardPacks(): CardPackSummary[] {
  return PACKS.map((p) => ({
    packId: p.meta.pack_id,
    title: p.meta.title,
    description: p.meta.description,
    count: p.cards.length,
  }));
}

export function getPackById(packId: string): CardPackJson | undefined {
  return PACKS.find((p) => p.meta.pack_id === packId);
}

export function getCardById(packId: string, cardId: string) {
  const pack = getPackById(packId);
  const card = pack?.cards.find((c) => c.id === cardId);
  return { pack, card };
}

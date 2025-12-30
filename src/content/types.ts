import type { ContentLang } from './lang';

export type CardLevel = 'beginner' | 'intermediate' | 'advanced';
export type CardType = 'learn' | 'practice';

export type Card = {
  id: string;
  type: CardType;
  level: CardLevel;
  title: string;
  summary: string;
  body_md: string;
  micro_practice?: { morning?: string; day?: string; night?: string };
  reflection_questions?: string[];
  tags?: string[];
  sources: string[];
};

export type CardPackJson = {
  meta: {
    version: string;
    language: ContentLang;
    pack_id: string;
    title: string;
    description?: string;
    generated_at?: string;
    card_schema?: Record<string, unknown>;
    [key: string]: unknown;
  };
  cards: Card[];
  bibliography?: Record<
    string,
    { title: string; publisher?: string; url?: string; accessed?: string }
  >;
};

export type GlossaryEntry = {
  id: string;
  term: string;
  reading?: string;
  category?: string;
  level?: CardLevel;
  short: string;
  definition: string;
  notes?: string;
  see_also?: string[];
  sources: string[];
};

export type GlossaryJson = {
  meta: {
    version: string;
    language: ContentLang;
    title: string;
    description?: string;
    generated_at?: string;
    schema?: Record<string, unknown>;
    [key: string]: unknown;
  };
  taxonomy?: { categories?: string[] };
  entries: GlossaryEntry[];
  bibliography?: Record<
    string,
    { title: string; publisher?: string; url?: string; accessed?: string }
  >;
};

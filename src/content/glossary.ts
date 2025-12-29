import type { GlossaryEntry, GlossaryJson } from './types';
import type { ContentLang } from './lang';

import glossaryJa from '../../content/glossary/glossary.ja.json';
import glossaryEn from '../../content/glossary/glossary.en.json';

const GLOSSARY_BY_LANG: Record<ContentLang, GlossaryJson> = {
  ja: glossaryJa as GlossaryJson,
  en: glossaryEn as GlossaryJson,
};

export function getGlossary(lang: ContentLang): GlossaryJson {
  return GLOSSARY_BY_LANG[lang];
}

export function getGlossaryEntry(lang: ContentLang, termId: string): GlossaryEntry | undefined {
  return GLOSSARY_BY_LANG[lang].entries.find((e) => e.id === termId);
}

import type { GlossaryEntry, GlossaryJson } from './types';
import type { ContentLang } from './lang';

import glossaryJa from '../../content/glossary/glossary.ja.json';
import glossaryEn from '../../content/glossary/glossary.en.json';

const GLOSSARY_BY_LANG: Record<ContentLang, GlossaryJson> = {
  ja: glossaryJa,
  en: glossaryEn,
};

export function getGlossary(): GlossaryJson;
export function getGlossary(lang: ContentLang): GlossaryJson;
export function getGlossary(lang: ContentLang = 'ja'): GlossaryJson {
  return GLOSSARY_BY_LANG[lang] ?? GLOSSARY_BY_LANG.ja;
}

export function getGlossaryEntry(termId: string): GlossaryEntry | undefined;
export function getGlossaryEntry(lang: ContentLang, termId: string): GlossaryEntry | undefined;
export function getGlossaryEntry(
  langOrTermId: ContentLang | string,
  maybeTermId?: string,
): GlossaryEntry | undefined {
  const lang = maybeTermId ? (langOrTermId as ContentLang) : 'ja';
  const termId = maybeTermId ?? (langOrTermId as string);
  const glossary = GLOSSARY_BY_LANG[lang] ?? GLOSSARY_BY_LANG.ja;
  return glossary.entries.find((e) => e.id === termId);
}

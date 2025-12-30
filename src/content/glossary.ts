/**
 * Purpose: Glossary registry and lookup utilities. / 目的: 用語集の登録と検索ユーティリティ。
 * Responsibilities: map language to glossary data and fetch entries by ID. / 役割: 言語→用語集の対応とID検索。
 * Inputs: glossary JSON modules, language code, term ID. / 入力: 用語集JSON、言語コード、用語ID。
 * Outputs: glossary data or specific entry. / 出力: 用語集データまたは個別エントリ。
 * Dependencies: content JSON modules and types. / 依存: コンテンツJSONモジュールと型。
 * Side effects: none. / 副作用: なし。
 * Edge cases: unknown lang/term returns undefined or falls back to ja. / 例外: 不明言語/用語はundefinedまたはjaにフォールバック。
 */
import type { GlossaryEntry, GlossaryJson } from './types';
import type { ContentLang } from './lang';

import glossaryJa from '../../content/glossary/glossary.ja.json';
import glossaryEn from '../../content/glossary/glossary.en.json';

// Static glossary data registry by language. / 言語別の静的用語集レジストリ。
const GLOSSARY_BY_LANG: Record<ContentLang, GlossaryJson> = {
  ja: glossaryJa,
  en: glossaryEn,
};

// Overload: default language when none provided. / 言語未指定時は既定言語。
export function getGlossary(): GlossaryJson;
export function getGlossary(lang: ContentLang): GlossaryJson;
export function getGlossary(lang: ContentLang = 'ja'): GlossaryJson {
  return GLOSSARY_BY_LANG[lang] ?? GLOSSARY_BY_LANG.ja;
}

// Overload: default language when only termId is provided. / termIdのみの場合は既定言語。
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

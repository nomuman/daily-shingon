import fs from 'node:fs';
import path from 'node:path';

import type { CardPackJson, GlossaryJson } from '../src/content/types';
import type { Curriculum30 } from '../src/types/curriculum';

const ROOT = path.resolve(__dirname, '..');
const CARDS_DIR = path.join(ROOT, 'content', 'cards');
const GLOSSARY_DIR = path.join(ROOT, 'content', 'glossary');
const CURRICULUM_DIR = path.join(ROOT, 'content', 'curriculum');

type Locale = 'ja' | 'en';

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function listJsonFiles(dirPath: string): string[] {
  return fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => path.join(dirPath, name));
}

function validateHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function collectCardPackPairs(): Map<string, Partial<Record<Locale, string>>> {
  const pairs = new Map<string, Partial<Record<Locale, string>>>();
  for (const filePath of listJsonFiles(CARDS_DIR)) {
    const fileName = path.basename(filePath);
    const match = fileName.match(/^(?<packId>.+)\.(?<locale>ja|en)\.json$/);
    if (!match?.groups) {
      continue;
    }
    const packId = match.groups.packId;
    const locale = match.groups.locale as Locale;
    const current = pairs.get(packId) ?? {};
    current[locale] = filePath;
    pairs.set(packId, current);
  }
  return pairs;
}

describe('content integrity', () => {
  it('validates card sources, bibliography linkage, and ja/en parity', () => {
    const issues: string[] = [];
    const packPairs = collectCardPackPairs();

    for (const [packId, pair] of packPairs.entries()) {
      if (!pair.ja || !pair.en) {
        issues.push(`[cards:${packId}] missing locale pair (ja:${!!pair.ja}, en:${!!pair.en})`);
        continue;
      }

      const jaPack = readJson<CardPackJson>(pair.ja);
      const enPack = readJson<CardPackJson>(pair.en);
      const jaCardIds = new Set(jaPack.cards.map((card) => card.id));
      const enCardIds = new Set(enPack.cards.map((card) => card.id));

      for (const cardId of jaCardIds) {
        if (!enCardIds.has(cardId)) {
          issues.push(`[cards:${packId}] missing in en: ${cardId}`);
        }
      }
      for (const cardId of enCardIds) {
        if (!jaCardIds.has(cardId)) {
          issues.push(`[cards:${packId}] missing in ja: ${cardId}`);
        }
      }

      for (const [locale, pack] of [
        ['ja', jaPack],
        ['en', enPack],
      ] as const) {
        const bibliography = pack.bibliography ?? {};
        const bibliographyKeys = new Set(Object.keys(bibliography));
        const referencedKeys = new Set<string>();
        const seenIds = new Set<string>();

        for (const card of pack.cards) {
          if (seenIds.has(card.id)) {
            issues.push(`[cards:${packId}.${locale}] duplicate card id: ${card.id}`);
          }
          seenIds.add(card.id);

          if (!Array.isArray(card.sources) || card.sources.length === 0) {
            issues.push(`[cards:${packId}.${locale}] ${card.id} has empty sources`);
            continue;
          }

          for (const sourceKey of card.sources) {
            referencedKeys.add(sourceKey);
            if (!bibliographyKeys.has(sourceKey)) {
              issues.push(
                `[cards:${packId}.${locale}] ${card.id} references unknown source: ${sourceKey}`,
              );
            }
          }
        }

        for (const [sourceKey, source] of Object.entries(bibliography)) {
          if (!referencedKeys.has(sourceKey)) {
            issues.push(`[cards:${packId}.${locale}] unused bibliography key: ${sourceKey}`);
          }
          if (source.url && !validateHttpUrl(source.url)) {
            issues.push(`[cards:${packId}.${locale}] invalid URL (${sourceKey}): ${source.url}`);
          }
        }
      }
    }

    expect(issues).toEqual([]);
  });

  it('validates glossary sources, see_also linkage, and ja/en parity', () => {
    const issues: string[] = [];
    const jaPath = path.join(GLOSSARY_DIR, 'glossary.ja.json');
    const enPath = path.join(GLOSSARY_DIR, 'glossary.en.json');
    const jaGlossary = readJson<GlossaryJson>(jaPath);
    const enGlossary = readJson<GlossaryJson>(enPath);

    const jaIds = new Set(jaGlossary.entries.map((entry) => entry.id));
    const enIds = new Set(enGlossary.entries.map((entry) => entry.id));

    for (const entryId of jaIds) {
      if (!enIds.has(entryId)) {
        issues.push(`[glossary] missing in en: ${entryId}`);
      }
    }
    for (const entryId of enIds) {
      if (!jaIds.has(entryId)) {
        issues.push(`[glossary] missing in ja: ${entryId}`);
      }
    }

    for (const [locale, glossary] of [
      ['ja', jaGlossary],
      ['en', enGlossary],
    ] as const) {
      const bibliography = glossary.bibliography ?? {};
      const bibliographyKeys = new Set(Object.keys(bibliography));
      const entryIds = new Set(glossary.entries.map((entry) => entry.id));
      const referencedKeys = new Set<string>();

      for (const entry of glossary.entries) {
        if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
          issues.push(`[glossary:${locale}] ${entry.id} has empty sources`);
          continue;
        }

        for (const sourceKey of entry.sources) {
          referencedKeys.add(sourceKey);
          if (!bibliographyKeys.has(sourceKey)) {
            issues.push(`[glossary:${locale}] ${entry.id} unknown source: ${sourceKey}`);
          }
        }

        for (const relatedId of entry.see_also ?? []) {
          if (!entryIds.has(relatedId)) {
            issues.push(`[glossary:${locale}] ${entry.id} invalid see_also: ${relatedId}`);
          }
        }
      }

      for (const [sourceKey, source] of Object.entries(bibliography)) {
        if (!referencedKeys.has(sourceKey)) {
          issues.push(`[glossary:${locale}] unused bibliography key: ${sourceKey}`);
        }
        if (source.url && !validateHttpUrl(source.url)) {
          issues.push(`[glossary:${locale}] invalid URL (${sourceKey}): ${source.url}`);
        }
      }
    }

    expect(issues).toEqual([]);
  });

  it('validates curriculum source references and sourceIndex URLs', () => {
    const issues: string[] = [];
    const curriculumFiles = ['30days.ja.json', '30days.en.json'];

    for (const fileName of curriculumFiles) {
      const filePath = path.join(CURRICULUM_DIR, fileName);
      const curriculum = readJson<Curriculum30>(filePath);
      const sourceIndexKeys = new Set(Object.keys(curriculum.sourceIndex ?? {}));

      for (const [key, url] of Object.entries(curriculum.sourceIndex ?? {})) {
        if (!validateHttpUrl(url)) {
          issues.push(`[curriculum:${fileName}] invalid sourceIndex URL (${key}): ${url}`);
        }
      }

      for (const day of curriculum.days) {
        for (const sourceKey of day.sources ?? []) {
          if (!sourceIndexKeys.has(sourceKey)) {
            issues.push(
              `[curriculum:${fileName}] day ${day.day} references missing sourceIndex key: ${sourceKey}`,
            );
          }
        }
      }
    }

    expect(issues).toEqual([]);
  });
});

import type { GlossaryEntry, GlossaryJson } from './types';

import glossary from '../../content/glossary/glossary.ja.json';

const GLOSSARY = glossary as GlossaryJson;

export function getGlossary(): GlossaryJson {
  return GLOSSARY;
}

export function getGlossaryEntry(termId: string): GlossaryEntry | undefined {
  return GLOSSARY.entries.find((e) => e.id === termId);
}

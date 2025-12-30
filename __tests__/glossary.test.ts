import { getGlossary, getGlossaryEntry } from '../src/content/glossary';

describe('glossary content', () => {
  it('returns glossary metadata and entries', () => {
    const glossary = getGlossary();
    expect(glossary.meta.language).toBe('ja');
    expect(glossary.entries.length).toBeGreaterThan(0);
  });

  it('finds entry by id', () => {
    const entry = getGlossaryEntry('core.shingon');
    expect(entry?.id).toBe('core.shingon');
    expect(entry?.term).toContain('真言');
  });
});

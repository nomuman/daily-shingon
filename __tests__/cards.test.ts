import { getCardById, getCardPacks, getPackById } from '../src/content/cards';

describe('cards content', () => {
  it('returns packs with counts', () => {
    const packs = getCardPacks();
    expect(packs.length).toBeGreaterThan(0);
    const core = packs.find((p) => p.packId === 'core');
    expect(core).toBeTruthy();
    expect(core?.count).toBeGreaterThan(0);
  });

  it('finds packs and cards by id', () => {
    const pack = getPackById('core');
    expect(pack?.meta.pack_id).toBe('core');

    const result = getCardById('core', 'core.sanmitsu');
    expect(result.pack?.meta.pack_id).toBe('core');
    expect(result.card?.id).toBe('core.sanmitsu');
  });
});

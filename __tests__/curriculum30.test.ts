import { getDayCard } from '../src/content/curriculum30.ja';

describe('getDayCard', () => {
  it('clamps day to the valid range', () => {
    expect(getDayCard(0).day).toBe(1);
    expect(getDayCard(1).day).toBe(1);
    expect(getDayCard(30).day).toBe(30);
    expect(getDayCard(999).day).toBe(30);
  });
});

import { diffDays, parseISODateLocal, toISODateLocal } from '../src/lib/date';

describe('date utils', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    const d = new Date(2025, 0, 5, 12, 30, 0, 0);
    expect(toISODateLocal(d)).toBe('2025-01-05');
  });

  it('parses YYYY-MM-DD as local midnight', () => {
    const d = parseISODateLocal('2025-12-31');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(11);
    expect(d.getDate()).toBe(31);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
    expect(d.getMilliseconds()).toBe(0);
  });

  it('computes day differences by local date', () => {
    const a = new Date(2025, 0, 2, 23, 59, 0, 0);
    const b = new Date(2025, 0, 1, 0, 1, 0, 0);
    expect(diffDays(a, b)).toBe(1);
    expect(diffDays(b, a)).toBe(-1);
  });
});

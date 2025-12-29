const mockRaw = {
  schemaVersion: '',
  locale: '',
  program: '',
  generatedAt: '',
  sourceIndex: { SRC: 'https://example.com' },
  days: [
    {
      day: 1,
      id: 'day-1',
      title: 'day1',
      learn: 'learn',
      nightQuestion: 'night',
      recommendedActionKey: 'body',
      actionOptions: [{ key: 'body', text: 'a' }],
    },
  ],
};

describe('curriculum normalization', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('fills missing days with fallback cards', () => {
    jest.doMock('../content/curriculum/30days.ja.json', () => mockRaw, { virtual: false });

    const mod = require('../src/content/curriculum30.ja');
    const curriculum = mod.curriculum30Ja;

    expect(curriculum.days).toHaveLength(30);
    expect(curriculum.days[0].id).toBe('day-1');
    expect(curriculum.days[1].id).toBe('fallback-day-2');
    expect(curriculum.schemaVersion).toBe('unknown');
  });
});

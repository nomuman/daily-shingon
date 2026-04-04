import AsyncStorage from '@react-native-async-storage/async-storage';

import { KEY_LAST_ACTIVE_DATE } from '../src/lib/engagement';
import { getNightLog, isNightComplete, setNightLog } from '../src/lib/nightLog';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('nightLog', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('detects completion state', () => {
    expect(isNightComplete(null)).toBe(false);
    expect(
      isNightComplete({
        dateISO: '2025-01-01',
        sangeDone: true,
        hotsuganDone: false,
        ekouDone: true,
        sange: 'body',
        hotsugan: null,
        ekou: 'all',
        note: '',
        savedAtISO: 'now',
      }),
    ).toBe(false);
    expect(
      isNightComplete({
        dateISO: '2025-01-01',
        sangeDone: true,
        hotsuganDone: true,
        ekouDone: true,
        sange: 'body',
        hotsugan: 'speech',
        ekou: 'all',
        note: '',
        savedAtISO: 'now',
      }),
    ).toBe(true);
  });

  it('stores and reads logs with note', async () => {
    const date = new Date(2025, 0, 2, 23, 0, 0, 0);
    await setNightLog({ sange: 'body', hotsugan: 'mind', ekou: 'all', note: 'ok', date });

    const stored = await getNightLog(date);
    expect(stored?.dateISO).toBe('2025-01-02');
    expect(stored?.sange).toBe('body');
    expect(stored?.hotsugan).toBe('mind');
    expect(stored?.ekou).toBe('all');
    expect(stored?.note).toBe('ok');
    expect(stored?.savedAtISO).toEqual(expect.any(String));

    await expect(AsyncStorage.getItem(KEY_LAST_ACTIVE_DATE)).resolves.toBe('2025-01-02');
  });
});

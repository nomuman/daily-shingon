import AsyncStorage from '@react-native-async-storage/async-storage';

import { KEY_LAST_ACTIVE_DATE } from '../src/lib/engagement';
import { getMorningLog, isMorningComplete, setMorningLog } from '../src/lib/morningLog';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('morningLog', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('detects completion state', () => {
    expect(isMorningComplete(null)).toBe(false);
    expect(
      isMorningComplete({
        dateISO: '2025-01-01',
        bodyDone: true,
        speechDone: false,
        mindDone: true,
        savedAtISO: 'now',
      }),
    ).toBe(false);
    expect(
      isMorningComplete({
        dateISO: '2025-01-01',
        bodyDone: true,
        speechDone: true,
        mindDone: true,
        savedAtISO: 'now',
      }),
    ).toBe(true);
  });

  it('stores and reads logs with date', async () => {
    const date = new Date(2025, 0, 2, 9, 0, 0, 0);
    await setMorningLog({ bodyDone: true, speechDone: false, mindDone: true, date });

    const stored = await getMorningLog(date);
    expect(stored?.dateISO).toBe('2025-01-02');
    expect(stored?.bodyDone).toBe(true);
    expect(stored?.speechDone).toBe(false);
    expect(stored?.mindDone).toBe(true);
    expect(stored?.savedAtISO).toEqual(expect.any(String));

    await expect(AsyncStorage.getItem(KEY_LAST_ACTIVE_DATE)).resolves.toBe('2025-01-02');
  });
});

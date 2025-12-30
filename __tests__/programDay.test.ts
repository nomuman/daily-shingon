import AsyncStorage from '@react-native-async-storage/async-storage';

import { getProgramDayInfo } from '../src/lib/programDay';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const KEY_START_DATE = 'curriculum30:startDateISO';

describe('getProgramDayInfo', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns Day1 and persists start date when none exists', async () => {
    const today = new Date(2025, 0, 1, 12, 0, 0, 0);
    const info = await getProgramDayInfo(today);

    expect(info.dayNumber).toBe(1);
    expect(info.isComplete).toBe(false);
    expect(info.startDateISO).toBe('2025-01-01');
    await expect(AsyncStorage.getItem(KEY_START_DATE)).resolves.toBe('2025-01-01');
  });

  it('returns Day30 on the 30th day', async () => {
    await AsyncStorage.setItem(KEY_START_DATE, '2025-01-01');
    const today = new Date(2025, 0, 30, 12, 0, 0, 0);
    const info = await getProgramDayInfo(today);

    expect(info.dayNumber).toBe(30);
    expect(info.isComplete).toBe(false);
  });

  it('clamps to Day30 after Day31 and marks complete', async () => {
    await AsyncStorage.setItem(KEY_START_DATE, '2025-01-01');
    const today = new Date(2025, 0, 31, 12, 0, 0, 0);
    const info = await getProgramDayInfo(today);

    expect(info.dayNumber).toBe(30);
    expect(info.isComplete).toBe(true);
  });
});

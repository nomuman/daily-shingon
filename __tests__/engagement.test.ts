import AsyncStorage from '@react-native-async-storage/async-storage';

import { getReturnStatus, KEY_LAST_ACTIVE_DATE, markActive } from '../src/lib/engagement';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('engagement', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('marks active date in storage', async () => {
    const date = new Date(2025, 0, 10, 9, 0, 0, 0);
    await markActive(date);
    await expect(AsyncStorage.getItem(KEY_LAST_ACTIVE_DATE)).resolves.toBe('2025-01-10');
  });

  it('returns non-return status when no activity', async () => {
    const status = await getReturnStatus(new Date(2025, 0, 10));
    expect(status).toEqual({ isReturn: false, gapDays: 0, lastActiveISO: null });
  });

  it('returns return status after a 2-day gap', async () => {
    await AsyncStorage.setItem(KEY_LAST_ACTIVE_DATE, '2025-01-01');
    const status = await getReturnStatus(new Date(2025, 0, 3));
    expect(status.isReturn).toBe(true);
    expect(status.gapDays).toBe(2);
    expect(status.lastActiveISO).toBe('2025-01-01');
  });
});

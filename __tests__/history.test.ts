import AsyncStorage from '@react-native-async-storage/async-storage';

import { getLastNDaysStatus } from '../src/lib/history';
import { setMorningLog } from '../src/lib/morningLog';
import { setNightLog } from '../src/lib/nightLog';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('history', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns statuses in newest-first order', async () => {
    const baseDate = new Date(2025, 0, 3, 12, 0, 0, 0);
    const prevDate = new Date(2025, 0, 2, 12, 0, 0, 0);

    await setMorningLog({ bodyDone: true, speechDone: true, mindDone: true, date: baseDate });
    await setNightLog({
      sangeDone: true,
      hotsuganDone: true,
      ekouDone: true,
      note: 'note',
      date: baseDate,
    });
    await setNightLog({
      sangeDone: true,
      hotsuganDone: false,
      ekouDone: true,
      note: '   ',
      date: prevDate,
    });

    const statuses = await getLastNDaysStatus(2, baseDate);
    expect(statuses).toHaveLength(2);
    expect(statuses[0].dateISO).toBe('2025-01-03');
    expect(statuses[0].morningDone).toBe(true);
    expect(statuses[0].nightDone).toBe(true);
    expect(statuses[0].nightHasNote).toBe(true);

    expect(statuses[1].dateISO).toBe('2025-01-02');
    expect(statuses[1].morningDone).toBe(false);
    expect(statuses[1].nightDone).toBe(false);
    expect(statuses[1].nightHasNote).toBe(false);
  });

  it('clamps days range to 1..31', async () => {
    const baseDate = new Date(2025, 0, 3, 12, 0, 0, 0);
    const min = await getLastNDaysStatus(0, baseDate);
    expect(min).toHaveLength(1);

    const max = await getLastNDaysStatus(40, baseDate);
    expect(max).toHaveLength(31);
  });
});

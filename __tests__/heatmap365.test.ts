import AsyncStorage from '@react-native-async-storage/async-storage';

import * as heatmap from '../src/lib/heatmap365';
import { setMorningLog } from '../src/lib/morningLog';
import { setNightLog } from '../src/lib/nightLog';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('heatmap365', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('returns batched statuses in newest-first order', async () => {
    const baseDate = new Date(2025, 0, 3, 12, 0, 0, 0);
    const prevDate = new Date(2025, 0, 2, 12, 0, 0, 0);

    await setMorningLog({ bodyDone: true, speechDone: true, mindDone: true, date: baseDate });
    await setNightLog({
      sangeDone: true,
      hotsuganDone: true,
      ekouDone: true,
      note: '',
      date: prevDate,
    });

    const statuses = await heatmap.getLastNDaysStatusBatched(2, 1, baseDate);
    expect(statuses).toHaveLength(2);
    expect(statuses[0].dateISO).toBe('2025-01-03');
    expect(statuses[1].dateISO).toBe('2025-01-02');
  });

  it('clamps days and batch sizes', async () => {
    const baseDate = new Date(2025, 0, 3, 12, 0, 0, 0);
    const statuses = await heatmap.getLastNDaysStatusBatched(500, 0, baseDate);
    expect(statuses).toHaveLength(400);
  });

  it('maps statuses to heatmap counts', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 0, 4, 12, 0, 0, 0));

    await setMorningLog({
      bodyDone: true,
      speechDone: true,
      mindDone: true,
      date: new Date(2025, 0, 2, 12, 0, 0, 0),
    });
    await setMorningLog({
      bodyDone: true,
      speechDone: true,
      mindDone: true,
      date: new Date(2025, 0, 3, 12, 0, 0, 0),
    });
    await setNightLog({
      sangeDone: true,
      hotsuganDone: true,
      ekouDone: true,
      note: '',
      date: new Date(2025, 0, 3, 12, 0, 0, 0),
    });
    await setMorningLog({
      bodyDone: true,
      speechDone: true,
      mindDone: true,
      date: new Date(2025, 0, 4, 12, 0, 0, 0),
    });
    await setNightLog({
      sangeDone: true,
      hotsuganDone: true,
      ekouDone: true,
      note: 'note',
      date: new Date(2025, 0, 4, 12, 0, 0, 0),
    });

    const values = await heatmap.getHeatmap365Values();
    const byDate = new Map(values.map((v) => [v.date, v.count]));

    expect(byDate.get('2025-01-01')).toBe(0);
    expect(byDate.get('2025-01-02')).toBe(1);
    expect(byDate.get('2025-01-03')).toBe(2);
    expect(byDate.get('2025-01-04')).toBe(3);

    jest.useRealTimers();
  });
});

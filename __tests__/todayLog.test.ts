import AsyncStorage from '@react-native-async-storage/async-storage';

import { getTodayActionSelection, setTodayActionSelection } from '../src/lib/todayLog';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('todayLog', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('stores and reads today selection', async () => {
    const date = new Date(2025, 0, 4, 9, 0, 0, 0);
    await setTodayActionSelection({ selectedKey: 'body', selectedText: 'test' }, date);

    const stored = await getTodayActionSelection(date);
    expect(stored?.selectedKey).toBe('body');
    expect(stored?.selectedText).toBe('test');
    expect(stored?.savedAtISO).toEqual(expect.any(String));
  });

  it('returns null when no selection exists', async () => {
    const date = new Date(2025, 0, 4, 9, 0, 0, 0);
    const stored = await getTodayActionSelection(date);
    expect(stored).toBeNull();
  });
});

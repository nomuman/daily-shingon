import AsyncStorage from '@react-native-async-storage/async-storage';

import { KEY_LAST_ACTIVE_DATE } from '../src/lib/engagement';
import { KEY_START_DATE } from '../src/lib/programDay';
import { resetAllProgress } from '../src/lib/reset';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('resetAllProgress', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('removes only progress-related keys', async () => {
    await AsyncStorage.setItem(KEY_START_DATE, '2025-01-01');
    await AsyncStorage.setItem(KEY_LAST_ACTIVE_DATE, '2025-01-02');
    await AsyncStorage.setItem('todayLog:action:2025-01-03', 'x');
    await AsyncStorage.setItem('morningLog:2025-01-03', 'x');
    await AsyncStorage.setItem('nightLog:2025-01-03', 'x');
    await AsyncStorage.setItem('other:key', 'keep');

    await resetAllProgress();

    await expect(AsyncStorage.getItem(KEY_START_DATE)).resolves.toBeNull();
    await expect(AsyncStorage.getItem(KEY_LAST_ACTIVE_DATE)).resolves.toBeNull();
    await expect(AsyncStorage.getItem('todayLog:action:2025-01-03')).resolves.toBeNull();
    await expect(AsyncStorage.getItem('morningLog:2025-01-03')).resolves.toBeNull();
    await expect(AsyncStorage.getItem('nightLog:2025-01-03')).resolves.toBeNull();
    await expect(AsyncStorage.getItem('other:key')).resolves.toBe('keep');
  });
});

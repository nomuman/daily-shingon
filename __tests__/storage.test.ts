import AsyncStorage from '@react-native-async-storage/async-storage';

import { getJSON, setJSON } from '../src/lib/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('round-trips JSON values', async () => {
    await setJSON('test:key', { value: 1, label: 'ok' });
    const result = await getJSON<{ value: number; label: string }>('test:key');
    expect(result).toEqual({ value: 1, label: 'ok' });
  });

  it('clears broken JSON and returns null', async () => {
    await AsyncStorage.setItem('test:broken', '{not-json');
    const result = await getJSON<{ value: number }>('test:broken');
    expect(result).toBeNull();
    await expect(AsyncStorage.getItem('test:broken')).resolves.toBeNull();
  });
});

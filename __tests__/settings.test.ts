import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, getSettings, setSettings } from '../src/lib/settings';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('settings', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns defaults when no settings are saved', async () => {
    const settings = await getSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it('merges defaults with partial saved settings', async () => {
    await AsyncStorage.setItem(
      '@dailyshingon/settings',
      JSON.stringify({ notifications: { enabled: true, morningTime: '06:00' } }),
    );

    const settings = await getSettings();
    expect(settings.notifications.enabled).toBe(true);
    expect(settings.notifications.morningTime).toBe('06:00');
    expect(settings.notifications.nightTime).toBe(DEFAULT_SETTINGS.notifications.nightTime);
  });

  it('round-trips settings', async () => {
    const next = {
      notifications: {
        enabled: true,
        morningTime: '08:00',
        nightTime: '22:00',
        morningId: 'm',
        nightId: 'n',
        permissionStatus: 'granted' as const,
      },
    };

    await setSettings(next);
    const stored = await getSettings();
    expect(stored).toEqual(next);
  });
});

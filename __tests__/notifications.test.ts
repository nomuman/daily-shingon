import {
  cancelDailyReminders,
  ensureNotificationPermission,
  parseTimeToTrigger,
  scheduleDailyReminders,
} from '../src/lib/notifications';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    select: (spec: { android: any; default: any }) =>
      spec && spec.android ? spec.android : spec?.default,
  },
}));

const mockScheduleNotificationAsync = jest.fn();
const mockCancelScheduledNotificationAsync = jest.fn();
const mockSetNotificationChannelAsync = jest.fn();
const mockGetPermissionsAsync = jest.fn();
const mockRequestPermissionsAsync = jest.fn();

jest.mock('expo-notifications', () => ({
  setNotificationChannelAsync: (...args: unknown[]) => mockSetNotificationChannelAsync(...args),
  getPermissionsAsync: (...args: unknown[]) => mockGetPermissionsAsync(...args),
  requestPermissionsAsync: (...args: unknown[]) => mockRequestPermissionsAsync(...args),
  scheduleNotificationAsync: (...args: unknown[]) => mockScheduleNotificationAsync(...args),
  cancelScheduledNotificationAsync: (...args: unknown[]) =>
    mockCancelScheduledNotificationAsync(...args),
  AndroidImportance: { DEFAULT: 'default' },
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

describe('notifications', () => {
  beforeEach(() => {
    mockScheduleNotificationAsync.mockReset();
    mockCancelScheduledNotificationAsync.mockReset();
    mockSetNotificationChannelAsync.mockReset();
    mockGetPermissionsAsync.mockReset();
    mockRequestPermissionsAsync.mockReset();
  });

  it('parses valid times and rejects invalid formats', () => {
    expect(parseTimeToTrigger('07:30')).toEqual({ hour: 7, minute: 30 });
    expect(parseTimeToTrigger('23:59')).toEqual({ hour: 23, minute: 59 });
    expect(parseTimeToTrigger('24:00')).toBeNull();
    expect(parseTimeToTrigger('7:3')).toBeNull();
  });

  it('requests permissions when not granted', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: 'denied' });
    mockRequestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    const result = await ensureNotificationPermission();
    expect(result).toBe('granted');
  });

  it('schedules reminders with valid times', async () => {
    mockScheduleNotificationAsync
      .mockResolvedValueOnce('morning-id')
      .mockResolvedValueOnce('night-id');

    const ids = await scheduleDailyReminders('07:30', '21:45');
    expect(ids).toEqual({ morningId: 'morning-id', nightId: 'night-id' });
    expect(mockSetNotificationChannelAsync).toHaveBeenCalledTimes(1);
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(2);

    const morningCall = mockScheduleNotificationAsync.mock.calls[0][0];
    expect(morningCall.trigger).toMatchObject({ hour: 7, minute: 30, type: 'daily' });
  });

  it('throws when times are invalid', async () => {
    await expect(scheduleDailyReminders('25:00', '09:00')).rejects.toThrow(
      'Invalid notification time',
    );
  });

  it('cancels scheduled reminders by id', async () => {
    await cancelDailyReminders({ morningId: 'm1', nightId: 'n1' });
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledTimes(2);
  });
});

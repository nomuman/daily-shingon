import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';

import ErrorState from '../../components/ErrorState';
import { cancelDailyReminders, ensureNotificationPermission, scheduleDailyReminders } from '../../lib/notifications';
import { resetAllProgress } from '../../lib/reset';
import { DEFAULT_SETTINGS, getSettings, setSettings } from '../../lib/settings';

type TimeField = 'morning' | 'night';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [settings, setLocalSettings] = useState(DEFAULT_SETTINGS);
  const [morningInput, setMorningInput] = useState(DEFAULT_SETTINGS.notifications.morningTime);
  const [nightInput, setNightInput] = useState(DEFAULT_SETTINGS.notifications.nightTime);
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showNightPicker, setShowNightPicker] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFatalError(null);
    setNotice(null);
    try {
      const saved = await getSettings();
      setLocalSettings(saved);
      setMorningInput(saved.notifications.morningTime);
      setNightInput(saved.notifications.nightTime);
    } catch {
      setFatalError('設定の読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reminderEnabled = settings.notifications.enabled;
  const permissionStatus = settings.notifications.permissionStatus;

  const validateTime = (value: string) => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
  };

  const toTimeString = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const timeToDate = (time: string) => {
    if (!validateTime(time)) return new Date();
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
  };

  const persistSettings = async (next: typeof settings) => {
    setLocalSettings(next);
    await setSettings(next);
  };

  const applyTime = async (field: TimeField, value: string) => {
    if (!validateTime(value)) {
      setNotice('時刻は24時間表記の HH:mm で入力してください。');
      return;
    }

    const prevIds = {
      morningId: settings.notifications.morningId,
      nightId: settings.notifications.nightId,
    };

    const next = {
      ...settings,
      notifications: {
        ...settings.notifications,
        morningTime: field === 'morning' ? value : settings.notifications.morningTime,
        nightTime: field === 'night' ? value : settings.notifications.nightTime,
      },
    };

    setNotice(null);
    if (next.notifications.enabled) {
      try {
        await cancelDailyReminders(prevIds);
        const ids = await scheduleDailyReminders(
          next.notifications.morningTime,
          next.notifications.nightTime
        );
        await persistSettings({
          ...next,
          notifications: { ...next.notifications, ...ids },
        });
      } catch {
        setNotice('通知の再設定に失敗しました。再試行してください。');
      }
    } else {
      await persistSettings(next);
    }
  };

  const handleTimeChange =
    (field: TimeField) => (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === 'android') {
        setShowMorningPicker(false);
        setShowNightPicker(false);
      }

      if (event.type === 'dismissed' || !date) return;

      const value = toTimeString(date);
      if (field === 'morning') setMorningInput(value);
      if (field === 'night') setNightInput(value);
      void applyTime(field, value);
    };

  const toggleReminders = async (nextEnabled: boolean) => {
    setNotice(null);
    if (!nextEnabled) {
      try {
        await cancelDailyReminders(settings.notifications);
        await persistSettings({
          ...settings,
          notifications: {
            ...settings.notifications,
            enabled: false,
            morningId: undefined,
            nightId: undefined,
          },
        });
      } catch {
        setNotice('通知の停止に失敗しました。');
      }
      return;
    }

    const status = await ensureNotificationPermission();
    if (status !== 'granted') {
      await persistSettings({
        ...settings,
        notifications: {
          ...settings.notifications,
          enabled: false,
          permissionStatus: status,
        },
      });
      setNotice('通知の許可が必要です。設定アプリから許可してください。');
      return;
    }

    try {
      const ids = await scheduleDailyReminders(
        settings.notifications.morningTime,
        settings.notifications.nightTime
      );
      await persistSettings({
        ...settings,
        notifications: {
          ...settings.notifications,
          enabled: true,
          permissionStatus: status,
          ...ids,
        },
      });
    } catch {
      setNotice('通知の設定に失敗しました。');
    }
  };

  const openSystemSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      setNotice('設定アプリを開けませんでした。');
    }
  };

  const handleReset = () => {
    Alert.alert(
      '開始日をリセット',
      '開始日・今日の行い・朝/夜ログ・復帰判定を削除します。よろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセットする',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetAllProgress();
            } catch {
              setNotice('リセットに失敗しました。');
            }
          },
        },
      ]
    );
  };

  const settingsSummary = useMemo(() => {
    return reminderEnabled ? '通知ON' : '通知OFF';
  }, [reminderEnabled]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (fatalError) {
    return <ErrorState message={fatalError} onRetry={load} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Settings</Text>

      {!!notice && (
        <View style={{ padding: 12, borderRadius: 12, backgroundColor: '#fff2f2' }}>
          <Text style={{ color: '#b00020' }}>{notice}</Text>
        </View>
      )}

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>通知</Text>
        <Text style={{ opacity: 0.7 }}>状態：{settingsSummary}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: '600' }}>朝/夜リマインダー</Text>
          <Switch value={reminderEnabled} onValueChange={toggleReminders} />
        </View>

        {permissionStatus === 'denied' && (
          <View style={{ gap: 8 }}>
            <Text style={{ opacity: 0.7 }}>
              通知が拒否されています。設定アプリで許可してください。
            </Text>
            <Pressable
              onPress={openSystemSettings}
              style={{
                minHeight: 44,
                paddingHorizontal: 12,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#eee',
              }}
            >
              <Text style={{ fontWeight: '700' }}>設定アプリを開く</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>通知時刻</Text>

        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: '600' }}>朝（HH:mm）</Text>
          <Pressable
            onPress={() => setShowMorningPicker(true)}
            style={{
              minHeight: 44,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 10,
              paddingHorizontal: 12,
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Text style={{ fontSize: 16 }}>{morningInput}</Text>
          </Pressable>
          {showMorningPicker && (
            <DateTimePicker
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={timeToDate(morningInput)}
              onChange={handleTimeChange('morning')}
            />
          )}
          {showMorningPicker && Platform.OS === 'ios' && (
            <Pressable
              onPress={() => setShowMorningPicker(false)}
              style={{
                alignSelf: 'flex-start',
                minHeight: 36,
                paddingHorizontal: 12,
                borderRadius: 8,
                justifyContent: 'center',
                backgroundColor: '#eee',
              }}
            >
              <Text style={{ fontWeight: '600' }}>完了</Text>
            </Pressable>
          )}
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: '600' }}>夜（HH:mm）</Text>
          <Pressable
            onPress={() => setShowNightPicker(true)}
            style={{
              minHeight: 44,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 10,
              paddingHorizontal: 12,
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Text style={{ fontSize: 16 }}>{nightInput}</Text>
          </Pressable>
          {showNightPicker && (
            <DateTimePicker
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={timeToDate(nightInput)}
              onChange={handleTimeChange('night')}
            />
          )}
          {showNightPicker && Platform.OS === 'ios' && (
            <Pressable
              onPress={() => setShowNightPicker(false)}
              style={{
                alignSelf: 'flex-start',
                minHeight: 36,
                paddingHorizontal: 12,
                borderRadius: 8,
                justifyContent: 'center',
                backgroundColor: '#eee',
              }}
            >
              <Text style={{ fontWeight: '600' }}>完了</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>リセット</Text>
        <Text style={{ opacity: 0.7 }}>
          開始日と当日の記録を削除します。戻せません。
        </Text>
        <Pressable
          onPress={handleReset}
          style={{
            minHeight: 44,
            paddingHorizontal: 12,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#f3bcbc',
          }}
        >
          <Text style={{ fontWeight: '700', color: '#b00020' }}>開始日をリセット</Text>
        </Pressable>
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>お問い合わせ</Text>
        <Text style={{ opacity: 0.7 }}>お問い合わせ先は後で設定します。</Text>
        {/* TODO: 問い合わせ先（メール or フォームURL）を設定する */}
      </View>
    </ScrollView>
  );
}

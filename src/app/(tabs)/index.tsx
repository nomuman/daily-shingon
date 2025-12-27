import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import ErrorState from '../../components/ErrorState';
import { getDayCard } from '../../content/curriculum30.ja';
import { getReturnStatus } from '../../lib/engagement';
import { getProgramDayInfo } from '../../lib/programDay';

import { clearMorningLog, getMorningLog, isMorningComplete } from '../../lib/morningLog';
import { clearNightLog, getNightLog, isNightComplete } from '../../lib/nightLog';
import { clearTodayActionSelection, getTodayActionSelection } from '../../lib/todayLog';

export default function HomeScreen() {
  const router = useRouter();

  const [dayNumber, setDayNumber] = useState<number>(1);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const [todayAction, setTodayAction] = useState<{ key: string; text: string } | null>(null);

  const [morningDone, setMorningDone] = useState<boolean>(false);
  const [nightDone, setNightDone] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const info = await getProgramDayInfo();
      setDayNumber(info.dayNumber);
      setIsComplete(info.isComplete);

      const card = getDayCard(info.dayNumber);
      setTitle(card.title);

      const sel = await getTodayActionSelection();
      setTodayAction(sel ? { key: sel.selectedKey, text: sel.selectedText } : null);

      const m = await getMorningLog();
      setMorningDone(isMorningComplete(m));

      const n = await getNightLog();
      setNightDone(isNightComplete(n));

      const returnStatus = await getReturnStatus();
      if (info.isComplete) {
        setStatusMessage('完走後モードです。必要なら設定からリセットできます。');
      } else if (returnStatus.isReturn) {
        setStatusMessage('おかえり。戻れたら十分。今日は短くでもOK。');
      } else {
        setStatusMessage(null);
      }
    } catch {
      setError('保存データの読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );
  // useFocusEffectは「画面がフォーカスされた時に処理を走らせる」ためのフック（公式）。:contentReference[oaicite:5]{index=5}

  type NextRoute = '/morning' | '/learn' | '/night';
  const nextAction = useMemo<{ label: string; route: NextRoute | null }>(() => {
    if (!morningDone) return { label: '朝を整える', route: '/morning' };
    if (!todayAction) return { label: '学びを見る', route: '/learn' };
    if (!nightDone) return { label: '夜を閉じる', route: '/night' };
    return { label: '今日はここまで', route: null };
  }, [morningDone, nightDone, todayAction]);

  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Home</Text>

      {!!statusMessage && (
        <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>メッセージ</Text>
          <Text style={{ lineHeight: 20 }}>{statusMessage}</Text>
          {isComplete && (
            <Pressable
              onPress={() => router.push('/settings')}
              style={{
                minHeight: 44,
                paddingHorizontal: 12,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#eee',
              }}
            >
              <Text style={{ fontWeight: '700' }}>設定でリセット</Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ opacity: 0.7 }}>次にやること</Text>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>{nextAction.label}</Text>
        <Pressable
          disabled={!nextAction.route}
          onPress={() => {
            if (nextAction.route) router.push(nextAction.route);
          }}
          style={[
            {
              minHeight: 44,
              paddingHorizontal: 12,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000',
            },
            !nextAction.route && {
              backgroundColor: '#ddd',
            },
          ]}
        >
          <Text style={{ color: nextAction.route ? '#fff' : '#555', fontWeight: '700' }}>
            {nextAction.route ? nextAction.label : '今日は十分できています'}
          </Text>
        </Pressable>
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ opacity: 0.7 }}>今日</Text>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Day {dayNumber}</Text>
        <Text style={{ lineHeight: 20 }}>{title}</Text>
      </View>

      {/* 朝の整え */}
      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>朝の整え（身・口・意）</Text>
        <Text style={{ opacity: 0.75 }}>状態：{morningDone ? '完了 ✅' : '未完了'}</Text>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={() => router.push('/morning')}
            style={{
              minHeight: 44,
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {morningDone ? '見直す' : 'やる'}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              try {
                await clearMorningLog();
                await refresh();
              } catch {
                setError(
                  '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
                );
              }
            }}
            style={{
              minHeight: 44,
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontWeight: '700' }}>リセット</Text>
          </Pressable>
        </View>
      </View>

      {/* 今日の行い */}
      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>今日の行い</Text>
        {todayAction ? (
          <Text style={{ lineHeight: 20 }}>
            ・[{todayAction.key}] {todayAction.text}
          </Text>
        ) : (
          <Text style={{ opacity: 0.7 }}>
            まだ選んでない。Learnで「今日はこれでいく」を押してね。
          </Text>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={() => router.push('/learn')}
            style={{
              minHeight: 44,
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Learnへ</Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              try {
                await clearTodayActionSelection();
                await refresh();
              } catch {
                setError(
                  '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
                );
              }
            }}
            style={{
              minHeight: 44,
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontWeight: '700' }}>選択を解除</Text>
          </Pressable>
        </View>
      </View>

      {/* 夜のしめ */}
      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>夜のしめ（懺悔→発願→回向）</Text>
        <Text style={{ opacity: 0.75 }}>状態：{nightDone ? '完了 ✅' : '未完了'}</Text>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={() => router.push('/night')}
            style={{
              minHeight: 44,
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {nightDone ? '見直す' : 'やる'}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              try {
                await clearNightLog();
                await refresh();
              } catch {
                setError(
                  '保存データの更新に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
                );
              }
            }}
            style={{
              minHeight: 44,
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ddd',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontWeight: '700' }}>リセット</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <Text style={{ opacity: 0.6 }}>
        ※ タブ移動・戻る操作で最新を反映するため、フォーカス時に再読み込みしています。
      </Text>
    </View>
  );
}

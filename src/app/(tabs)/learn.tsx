import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import ErrorState from '../../components/ErrorState';
import { curriculum30Ja, getDayCard } from '../../content/curriculum30.ja';
import { getProgramDayInfo } from '../../lib/programDay';
import { getTodayActionSelection, setTodayActionSelection } from '../../lib/todayLog';
import type { CurriculumDay, SanmitsuKey } from '../../types/curriculum';

type SelectedAction = {
  key: SanmitsuKey;
  text: string;
};

export default function LearnScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<{ dayNumber: number; isComplete: boolean } | null>(null);
  const [card, setCard] = useState<CurriculumDay | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 選択状態（3択のうちどれを選んでるか）
  const [selected, setSelected] = useState<SelectedAction | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getProgramDayInfo();
      setDayInfo({ dayNumber: info.dayNumber, isComplete: info.isComplete });

      const c = getDayCard(info.dayNumber);
      setCard(c);

      // 今日すでに選んでるなら復元
      const saved = await getTodayActionSelection();
      if (saved) {
        setSelected({ key: saved.selectedKey, text: saved.selectedText });
      } else {
        // まだなら「おすすめ」をデフォルトにする
        const recommended = c.actionOptions.find((o) => o.key === c.recommendedActionKey);
        const fallbackText = recommended?.text ?? c.actionOptions[0]?.text ?? '';
        setSelected({ key: c.recommendedActionKey, text: fallbackText });
      }
    } catch {
      setError('学びデータの読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sourceLinks = useMemo(() => {
    if (!card?.sources?.length) return [];
    return card.sources
      .map((id) => ({ id, url: curriculum30Ja.sourceIndex[id] }))
      .filter((x) => !!x.url);
  }, [card]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!card || !dayInfo || !selected) {
    return (
      <View style={{ padding: 16 }}>
        <Text>今日のカードを読み込めなかった。</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>
        Day {dayInfo.dayNumber} / 30
      </Text>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{card.title}</Text>
        <Text style={{ lineHeight: 20 }}>{card.learn}</Text>

        {!!card.example && (
          <Text style={{ opacity: 0.75, lineHeight: 20 }}>
            例：{card.example}
          </Text>
        )}
      </View>

      {/* 3択選択UI */}
      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>今日の行い（1つ選ぶ）</Text>

        {card.actionOptions.map((opt, idx) => {
          const isSelected = selected.key === opt.key && selected.text === opt.text;
          const isRecommended = opt.key === card.recommendedActionKey;

          return (
            <Pressable
              key={`${opt.key}-${idx}`}
              onPress={() => setSelected({ key: opt.key, text: opt.text })}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[
                {
                  minHeight: 44,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  backgroundColor: '#fff',
                },
                isSelected && {
                  borderColor: '#000',
                  borderWidth: 2,
                },
              ]}
            >
              <Text style={{ fontWeight: isSelected ? '700' : '400', lineHeight: 20 }}>
                ・[{opt.key}] {opt.text}
              </Text>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                {isRecommended && (
                  <Text style={{ fontSize: 12, opacity: 0.7 }}>おすすめ</Text>
                )}
                {isSelected && (
                  <Text style={{ fontSize: 12, opacity: 0.7 }}>選択中</Text>
                )}
              </View>
            </Pressable>
          );
        })}

        <Text style={{ fontSize: 12, opacity: 0.65 }}>
          ※おすすめは目安。今日はあなたの感覚で選んでOK。
        </Text>
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>夜の問い</Text>
        <Text style={{ lineHeight: 20 }}>{card.nightQuestion}</Text>
      </View>

      {!!sourceLinks.length && (
        <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>参考</Text>
          {sourceLinks.map((s) => (
            <Text key={s.id} style={{ opacity: 0.8 }}>
              ・{s.id}
            </Text>
          ))}
        </View>
      )}

      {/* 保存ボタン */}
      <Pressable
        onPress={async () => {
          try {
            await setTodayActionSelection({
              selectedKey: selected.key,
              selectedText: selected.text,
            });
            router.replace('/'); // Homeへ
          } catch {
            setError(
              '保存に失敗しました。再試行しても直らない場合は、アプリを再起動してください。'
            );
          }
        }}
        style={{
          minHeight: 44,
          padding: 14,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>今日はこれでいく</Text>
      </Pressable>
    </ScrollView>
  );
}

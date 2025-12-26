import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { curriculum30Ja, getDayCard } from '../../content/curriculum30.ja';
import { getProgramDayInfo } from '../../lib/programDay';
import type { CurriculumDay } from '../../types/curriculum';

export default function LearnScreen() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<{ dayNumber: number; isComplete: boolean } | null>(null);
  const [card, setCard] = useState<CurriculumDay | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const info = await getProgramDayInfo();
        setDayInfo({ dayNumber: info.dayNumber, isComplete: info.isComplete });
        setCard(getDayCard(info.dayNumber));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  if (!card || !dayInfo) {
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

      {dayInfo.isComplete && (
        <Text style={{ opacity: 0.8 }}>
          30日を完走した。ここからは薄く長く。必要なら開始日をリセットしてもう一周もできる。
        </Text>
      )}

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{card.title}</Text>
        <Text style={{ lineHeight: 20 }}>{card.learn}</Text>

        {!!card.example && (
          <Text style={{ opacity: 0.75, lineHeight: 20 }}>
            例：{card.example}
          </Text>
        )}
      </View>

      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>今日の行い（1つ選ぶ）</Text>
        {card.actionOptions.map((opt, idx) => (
          <View key={`${opt.key}-${idx}`} style={{ paddingVertical: 8 }}>
            <Text style={{ fontWeight: opt.key === card.recommendedActionKey ? '700' : '400' }}>
              ・[{opt.key}] {opt.text}
            </Text>
          </View>
        ))}
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
          {/* URLを表示したいならここで出してもOK（今はIDのみ） */}
        </View>
      )}

      <Pressable
        onPress={() => {
          // TODO: “今日の行い”の選択を保存する（次ステップ）
        }}
        style={{ padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#000' }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>今日はこれでいく</Text>
      </Pressable>
    </ScrollView>
  );
}

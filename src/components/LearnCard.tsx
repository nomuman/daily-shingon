import { Text, View } from 'react-native';

import type { CurriculumDay } from '../types/curriculum';

type SourceLink = {
  id: string;
};

type LearnCardProps = {
  dayNumber: number;
  isComplete?: boolean;
  card: CurriculumDay;
  sourceLinks?: SourceLink[];
};

export default function LearnCard({ dayNumber, isComplete, card, sourceLinks }: LearnCardProps) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>
        Day {dayNumber} / 30
      </Text>

      {isComplete && (
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

      {!!sourceLinks?.length && (
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
    </View>
  );
}

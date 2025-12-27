import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import LearnCard from "../../components/LearnCard";
import { curriculum30Ja, getDayCard } from "../../content/curriculum30.ja";
import { getProgramDayInfo } from "../../lib/programDay";
import { setTodayActionSelection } from '../../lib/todayLog';
import type { CurriculumDay } from "../../types/curriculum";

export default function LearnScreen() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<{
    dayNumber: number;
    isComplete: boolean;
  } | null>(null);
  const [card, setCard] = useState<CurriculumDay | null>(null);
  const router = useRouter();

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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
      <LearnCard
        dayNumber={dayInfo.dayNumber}
        isComplete={dayInfo.isComplete}
        card={card}
        sourceLinks={sourceLinks}
      />

      <Pressable
        onPress={async () => {
          // まずは「おすすめの行い」をそのまま採用（後で選択UIに拡張）
          const recommended = card.actionOptions.find(
            (o) => o.key === card.recommendedActionKey
          );
          const selectedText =
            recommended?.text ?? card.actionOptions[0]?.text ?? "";

          await setTodayActionSelection({
            selectedKey: card.recommendedActionKey,
            selectedText,
          });

          // Homeに戻る（Tabsのindexへ）
          router.replace("/"); // or router.push('/')
        }}
        style={{
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          今日はこれでいく
        </Text>
      </Pressable>
    </ScrollView>
  );
}

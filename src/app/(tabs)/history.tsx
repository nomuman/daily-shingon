import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";
import ErrorState from "../../components/ErrorState";
import { toISODateLocal } from "../../lib/date";
import { getHeatmap365Values, type HeatmapValue } from "../../lib/heatmap365";

const screenWidth = Dimensions.get("window").width;

const labelForCount = (count: number) => {
  if (count >= 3) return "朝+夜+メモ";
  if (count === 2) return "朝+夜";
  if (count === 1) return "朝or夜";
  return "なし";
};

const formatDateLabel = (date: string | Date | null | undefined) => {
  if (!date) return "日付不明";
  if (date instanceof Date) return toISODateLocal(date);
  if (typeof date === "string") return date;
  return "日付不明";
};

const buildTooltipLabel = (value: unknown) => {
  if (!value || typeof value !== "object") return "日付不明：なし";
  const raw = value as { date?: string | Date; count?: number; value?: number };
  const count =
    typeof raw.count === "number" ? raw.count : typeof raw.value === "number" ? raw.value : 0;
  const dateLabel = formatDateLabel(raw.date);
  return `${dateLabel}：${labelForCount(count)}`;
};

export default function HistoryScreen() {
  const router = useRouter();

  const [values, setValues] = useState<HeatmapValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltipLabel, setTooltipLabel] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const v = await getHeatmap365Values();
      setValues(v);
    } catch {
      setError(
        "履歴データの読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700" }}>365日</Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 10,
            backgroundColor: "#ddd",
          }}
        >
          <Text style={{ fontWeight: "700" }}>Back</Text>
        </Pressable>
      </View>

      <Text style={{ opacity: 0.7 }}>
        勤行が終わった日（朝/夜/両方/メモ）を、静かに積み上げる可視化。
      </Text>

      <View style={{ padding: 12, borderRadius: 12, backgroundColor: "#fff" }}>
        {loading ? (
          <Text style={{ opacity: 0.7 }}>読み込み中…</Text>
        ) : (
          <ContributionGraph
            values={values}
            endDate={new Date()}
            numDays={365}
            width={Math.min(screenWidth - 32, 900)}
            height={220}
            gutterSize={2}
            squareSize={12}
            showMonthLabels
            onDayPress={(item: { date?: string | Date; count?: number }) => {
              setTooltipLabel(buildTooltipLabel(item));
              if (!item?.date) return;
              const dateLabel = item.date instanceof Date ? toISODateLocal(item.date) : item.date;
              router.push(`/day/${dateLabel}`);
            }}
            titleForValue={(value) => buildTooltipLabel(value)}
            chartConfig={{
              backgroundGradientFrom: "transparent",
              backgroundGradientTo: "transparent",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 170, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            tooltipDataAttrs={(value) => ({
              accessibilityLabel: buildTooltipLabel(value),
              onLongPress: () => setTooltipLabel(buildTooltipLabel(value)),
              delayLongPress: 150,
            })}
          />
        )}
      </View>

      {tooltipLabel ? (
        <View style={{ padding: 10, borderRadius: 10, backgroundColor: "#f2f2f2" }}>
          <Text style={{ fontSize: 12, opacity: 0.7 }}>ツールチップ</Text>
          <Text style={{ fontWeight: "700" }}>{tooltipLabel}</Text>
        </View>
      ) : (
        <Text style={{ opacity: 0.6, fontSize: 12 }}>長押しで日付ラベルを表示</Text>
      )}

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "700" }}>凡例</Text>
        <Text style={{ opacity: 0.8 }}>
          0: なし / 1: 朝or夜 / 2: 朝+夜 / 3: 朝+夜+メモ
        </Text>
        <Text style={{ opacity: 0.6, fontSize: 12 }}>
          ※連続日数（streak）は出さない。空白があっても戻れる設計。
        </Text>
      </View>
    </ScrollView>
  );
}

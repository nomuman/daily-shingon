import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContributionGraph } from 'react-native-chart-kit';

import ErrorState from '../components/ErrorState';
import { toISODateLocal } from '../lib/date';
import { getHeatmap365Values, type HeatmapValue } from '../lib/heatmap365';
import { cardShadow, theme } from '../ui/theme';

const screenWidth = Dimensions.get('window').width;
const chartDays = 365;
const chartSquareSize = 12;
const chartGutterSize = 2;
const chartPaddingLeft = 32;
const chartDaysInWeek = 7;
const chartMonthLabelGutter = 8;
const chartHeight =
  chartDaysInWeek * (chartSquareSize + chartGutterSize) +
  (chartSquareSize + chartMonthLabelGutter - chartGutterSize) +
  36;

const getContributionGraphWidth = (endDate: Date) => {
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (chartDays - 1));
  const startEmptyDays = startDate.getDay();
  const endEmptyDays = 6 - endDate.getDay();
  const weekCount = Math.ceil((chartDays + startEmptyDays + endEmptyDays) / 7);
  const squareSizeWithGutter = chartSquareSize + chartGutterSize;
  return chartPaddingLeft + weekCount * squareSizeWithGutter - chartGutterSize;
};

const labelForCount = (count: number) => {
  if (count >= 3) return '朝+夜+メモ';
  if (count === 2) return '朝+夜';
  if (count === 1) return '朝or夜';
  return 'なし';
};

const formatDateLabel = (date: string | Date | null | undefined) => {
  if (!date) return '日付不明';
  if (date instanceof Date) return toISODateLocal(date);
  if (typeof date === 'string') return date;
  return '日付不明';
};

const buildTooltipLabel = (value: unknown) => {
  if (!value || typeof value !== 'object') return '日付不明：なし';
  const raw = value as { date?: string | Date; count?: number; value?: number };
  const count =
    typeof raw.count === 'number' ? raw.count : typeof raw.value === 'number' ? raw.value : 0;
  const dateLabel = formatDateLabel(raw.date);
  return `${dateLabel}：${labelForCount(count)}`;
};

const entranceStyle = (anim: Animated.Value) => ({
  opacity: anim,
  transform: [
    {
      translateY: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
    },
  ],
});

export default function HistoryScreen() {
  const router = useRouter();

  const [values, setValues] = useState<HeatmapValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltipLabel, setTooltipLabel] = useState<string | null>(null);
  const endDate = new Date();
  const graphWidth = Math.max(screenWidth - 32, getContributionGraphWidth(endDate));

  const headerAnim = useRef(new Animated.Value(0)).current;
  const graphAnim = useRef(new Animated.Value(0)).current;
  const legendAnim = useRef(new Animated.Value(0)).current;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const v = await getHeatmap365Values();
      setValues(v);
    } catch {
      setError(
        '履歴データの読み込みに失敗しました。再試行しても直らない場合は、アプリを再起動してください。',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  useEffect(() => {
    Animated.stagger(140, [
      Animated.timing(headerAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(graphAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(legendAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
    ]).start();
  }, [graphAnim, headerAnim, legendAnim]);

  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Animated.View style={[styles.headerCard, entranceStyle(headerAnim)]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>365日</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
          >
            <Text style={styles.ghostButtonText}>戻る</Text>
          </Pressable>
        </View>
        <Text style={styles.headerBody}>
          勤行が終わった日（朝/夜/両方/メモ）を、静かに積み上げる可視化。
        </Text>
      </Animated.View>

      <Animated.View style={[styles.graphCard, entranceStyle(graphAnim)]}>
        {loading ? (
          <Text style={styles.loadingText}>読み込み中…</Text>
        ) : (
          <ScrollView horizontal contentContainerStyle={{ paddingRight: 12 }}>
            <ContributionGraph
              values={values}
              endDate={endDate}
              numDays={chartDays}
              width={graphWidth}
              height={chartHeight}
              gutterSize={chartGutterSize}
              squareSize={chartSquareSize}
              showMonthLabels
              onDayPress={(item: { date?: string | Date; count?: number }) => {
                setTooltipLabel(buildTooltipLabel(item));
                if (!item?.date) return;
                const dateLabel = item.date instanceof Date ? toISODateLocal(item.date) : item.date;
                router.push(`/day/${dateLabel}`);
              }}
              titleForValue={(value) => buildTooltipLabel(value)}
              chartConfig={{
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(195, 139, 47, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(28, 26, 22, ${opacity})`,
              }}
              tooltipDataAttrs={(value) => ({
                accessibilityLabel: buildTooltipLabel(value),
                onLongPress: () => setTooltipLabel(buildTooltipLabel(value)),
                delayLongPress: 150,
              })}
            />
          </ScrollView>
        )}
      </Animated.View>

      <Animated.View style={[styles.metaStack, entranceStyle(legendAnim)]}>
        {tooltipLabel ? (
          <View style={styles.tooltipCard}>
            <Text style={styles.tooltipLabel}>ツールチップ</Text>
            <Text style={styles.tooltipValue}>{tooltipLabel}</Text>
          </View>
        ) : (
          <Text style={styles.helperText}>長押しで日付ラベルを表示</Text>
        )}

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>凡例</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendSwatch, styles.legendSwatch0]} />
            <Text style={styles.legendText}>0: なし</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendSwatch, styles.legendSwatch1]} />
            <Text style={styles.legendText}>1: 朝or夜</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendSwatch, styles.legendSwatch2]} />
            <Text style={styles.legendText}>2: 朝+夜</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendSwatch, styles.legendSwatch3]} />
            <Text style={styles.legendText}>3: 朝+夜+メモ</Text>
          </View>
          <Text style={styles.legendNote}>
            ※連続日数（streak）は出さない。空白があっても戻れる設計。
          </Text>
        </View>
      </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
    gap: theme.spacing.md,
  },
  headerCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
    ...cardShadow,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: theme.font.display,
    color: theme.colors.ink,
  },
  headerBody: {
    color: theme.colors.inkMuted,
    lineHeight: 20,
    fontFamily: theme.font.body,
  },
  graphCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    ...cardShadow,
  },
  loadingText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  ghostButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceMuted,
  },
  ghostButtonPressed: {
    opacity: 0.85,
  },
  ghostButtonText: {
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  metaStack: {
    gap: theme.spacing.sm,
  },
  tooltipCard: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
  },
  tooltipLabel: {
    fontSize: 11,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  tooltipValue: {
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  legendCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  legendTitle: {
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendSwatch0: {
    backgroundColor: theme.colors.border,
  },
  legendSwatch1: {
    backgroundColor: `${theme.colors.accent}55`,
  },
  legendSwatch2: {
    backgroundColor: `${theme.colors.accent}99`,
  },
  legendSwatch3: {
    backgroundColor: theme.colors.accent,
  },
  legendText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  legendNote: {
    fontSize: 12,
    color: theme.colors.inkMuted,
    marginTop: 4,
    fontFamily: theme.font.body,
  },
});

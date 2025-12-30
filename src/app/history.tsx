/**
 * Purpose: History screen with a 365-day contribution heatmap and legend. / 目的: 365日ヒートマップと凡例の履歴画面。
 * Responsibilities: load heatmap values, render chart, handle day navigation, and show tooltips. / 役割: ヒートマップ読込、描画、日別遷移、ツールチップ表示。
 * Inputs: stored history data, theme tokens, translations. / 入力: 保存履歴データ、テーマトークン、翻訳文言。
 * Outputs: chart UI + navigation to per-day detail. / 出力: チャートUIと日別詳細への遷移。
 * Dependencies: react-native-chart-kit, heatmap data loader, Expo Router, i18n. / 依存: react-native-chart-kit、ヒートマップローダー、Expo Router、i18n。
 * Side effects: data load from storage; navigation on day press. / 副作用: ストレージ読込、日付タップで遷移。
 * Edge cases: empty data, invalid tooltip data, screen width changes. / 例外: データなし、ツールチップ不正、画面幅変化。
 */
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import ErrorState from '../components/ErrorState';
import { toISODateLocal } from '../lib/date';
import { getHeatmap365Values, type HeatmapValue } from '../lib/heatmap365';
import { useTheme, useThemedStyles, type CardShadow, type Theme } from '../ui/theme';

// Layout constants for the contribution graph. / ヒートマップレイアウト定数。
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

// Compute required graph width so all weeks fit without clipping. / 週表示が欠けない幅を算出。
const getContributionGraphWidth = (endDate: Date) => {
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (chartDays - 1));
  const startEmptyDays = startDate.getDay();
  const endEmptyDays = 6 - endDate.getDay();
  const weekCount = Math.ceil((chartDays + startEmptyDays + endEmptyDays) / 7);
  const squareSizeWithGutter = chartSquareSize + chartGutterSize;
  return chartPaddingLeft + weekCount * squareSizeWithGutter - chartGutterSize;
};

// Map practice count to human-friendly label. / 実践回数をラベル化。
const labelForCount = (
  t: (key: string, options?: Record<string, unknown>) => string,
  count: number,
) => {
  if (count >= 3) return t('history.count3');
  if (count === 2) return t('history.count2');
  if (count === 1) return t('history.count1');
  return t('common.none');
};

// Normalize date input into a label for tooltips. / ツールチップ用の日付表記へ正規化。
const formatDateLabel = (t: (key: string) => string, date: string | Date | null | undefined) => {
  if (!date) return t('common.unknownDate');
  if (date instanceof Date) return toISODateLocal(date);
  if (typeof date === 'string') return date;
  return t('common.unknownDate');
};

// Build tooltip string for chart accessibility + long-press. / アクセシビリティと長押し用のツールチップ文言。
const buildTooltipLabel = (
  t: (key: string, options?: Record<string, unknown>) => string,
  value: unknown,
) => {
  if (!value || typeof value !== 'object') return t('history.tooltipUnknown');
  const raw = value as { date?: string | Date; count?: number; value?: number };
  const count =
    typeof raw.count === 'number' ? raw.count : typeof raw.value === 'number' ? raw.value : 0;
  const dateLabel = formatDateLabel(t, raw.date);
  return t('history.tooltipLabel', { date: dateLabel, status: labelForCount(t, count) });
};

// Shared entrance animation for sections. / セクション共通の登場アニメーション。
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
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [values, setValues] = useState<HeatmapValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltipLabel, setTooltipLabel] = useState<string | null>(null);
  const endDate = new Date();
  const graphWidth = Math.max(screenWidth - 32, getContributionGraphWidth(endDate));

  const headerAnim = useRef(new Animated.Value(0)).current;
  const graphAnim = useRef(new Animated.Value(0)).current;
  const legendAnim = useRef(new Animated.Value(0)).current;

  // Load heatmap values when focused or refreshed. / フォーカス時・更新時に値を読込。
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const v = await getHeatmap365Values();
      setValues(v);
    } catch {
      setError(t('errors.historyLoadFail'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Refresh on focus to reflect recent changes. / フォーカス時に最新状態へ更新。
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  // Stagger in header/graph/legend visuals. / ヘッダー・グラフ・凡例を順次表示。
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
            <Text style={styles.headerTitle}>{t('history.title')}</Text>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
            >
              <Text style={styles.ghostButtonText}>{t('common.back')}</Text>
            </Pressable>
          </View>
          <Text style={styles.headerBody}>{t('history.headerBody')}</Text>
        </Animated.View>

        <Animated.View style={[styles.graphCard, entranceStyle(graphAnim)]}>
          {loading ? (
            <Text style={styles.loadingText}>{t('common.loading')}</Text>
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
                // Navigate to day detail only when a date is available. / 日付がある場合のみ詳細へ遷移。
                onDayPress={(item: { date?: string | Date; count?: number }) => {
                  if (!item?.date) return;
                  const dateLabel =
                    item.date instanceof Date ? toISODateLocal(item.date) : item.date;
                  router.push(`/day/${dateLabel}`);
                }}
                titleForValue={(value) => buildTooltipLabel(t, value)}
                chartConfig={{
                  backgroundGradientFrom: theme.colors.surface,
                  backgroundGradientTo: theme.colors.surface,
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientToOpacity: 0,
                  decimalPlaces: 0,
                  color: () => theme.colors.accent,
                  labelColor: () => theme.colors.inkMuted,
                }}
                // Enable accessibility label + long-press tooltip. / アクセシビリティと長押しツールチップを設定。
                tooltipDataAttrs={(value) => ({
                  accessibilityLabel: buildTooltipLabel(t, value),
                  onLongPress: () => setTooltipLabel(buildTooltipLabel(t, value)),
                  delayLongPress: 150,
                })}
              />
            </ScrollView>
          )}
        </Animated.View>

        <Animated.View style={[styles.metaStack, entranceStyle(legendAnim)]}>
          {tooltipLabel ? (
            <View style={styles.tooltipCard}>
              <Text style={styles.tooltipLabel}>{t('history.tooltipTitle')}</Text>
              <Text style={styles.tooltipValue}>{tooltipLabel}</Text>
            </View>
          ) : (
            <Text style={styles.helperText}>{t('history.tooltipHint')}</Text>
          )}

          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>{t('history.legendTitle')}</Text>
            <View style={styles.legendRow}>
              <View style={[styles.legendSwatch, styles.legendSwatch0]} />
              <Text style={styles.legendText}>{t('history.legend0')}</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendSwatch, styles.legendSwatch1]} />
              <Text style={styles.legendText}>{t('history.legend1')}</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendSwatch, styles.legendSwatch2]} />
              <Text style={styles.legendText}>{t('history.legend2')}</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendSwatch, styles.legendSwatch3]} />
              <Text style={styles.legendText}>{t('history.legend3')}</Text>
            </View>
            <Text style={styles.legendNote}>{t('history.legendNote')}</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme, cardShadow: CardShadow) =>
  StyleSheet.create({
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

/**
 * Purpose: Day detail screen for a specific date. / 目的: 特定日付の詳細画面。
 * Responsibilities: load morning/night completion + note, and link to edit screens. / 役割: 朝夜の完了/メモ読込と編集画面への導線。
 * Inputs: route param date, stored logs, translations. / 入力: ルート日付パラメータ、保存済みログ、翻訳文言。
 * Outputs: status summary UI and navigation actions. / 出力: ステータス要約UIと遷移アクション。
 * Dependencies: morning/night log loaders, date parser, Expo Router, i18n. / 依存: 朝夜ログローダー、日付パーサ、Expo Router、i18n。
 * Side effects: data reads from storage; navigation to morning/night screens. / 副作用: ストレージ読込、朝/夜画面への遷移。
 * Edge cases: missing date param, missing logs. / 例外: 日付未指定、ログ欠落。
 */
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import Screen from '../../components/Screen';
import SurfaceCard from '../../components/SurfaceCard';
import { AppIcon } from '../../components/AppIcon';
import { parseISODateLocal } from '../../lib/date';
import { getMorningLog, isMorningComplete } from '../../lib/morningLog';
import { getNightLog, isNightComplete } from '../../lib/nightLog';
import { useResponsiveLayout } from '../../ui/responsive';
import { useTheme, useThemedStyles } from '../../ui/theme';

export default function DayDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const responsive = useResponsiveLayout();
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      screen: {
        flex: 1,
        backgroundColor: 'transparent',
      },
      content: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
        gap: theme.spacing.md,
      },
      headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: theme.spacing.sm,
      },
      title: {
        fontSize: 18,
        fontFamily: theme.font.display,
        color: theme.colors.ink,
        letterSpacing: 0.3,
        lineHeight: 26,
      },
      card: {
        gap: theme.spacing.sm,
      },
      sectionTitle: {
        fontSize: 16,
        color: theme.colors.ink,
        fontFamily: theme.font.bodyBold,
      },
      bodyText: {
        color: theme.colors.ink,
        fontFamily: theme.font.body,
      },
      mutedText: {
        color: theme.colors.inkMuted,
        fontFamily: theme.font.body,
      },
      statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
      },
      rowButtons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
      },
      primaryButton: {
        flex: 1,
      },
    }),
  );
  const { date } = useLocalSearchParams<{ date?: string }>();

  const [morningDone, setMorningDone] = useState(false);
  const [nightDone, setNightDone] = useState(false);
  const [note, setNote] = useState('');

  // Load day-specific logs and compute completion status. / 日別ログを読み込み、完了状態を算出。
  const load = useCallback(async () => {
    if (!date) return;
    const day = parseISODateLocal(date);

    const morning = await getMorningLog(day);
    const night = await getNightLog(day);

    setMorningDone(isMorningComplete(morning));
    setNightDone(isNightComplete(night));
    setNote(night?.note ?? '');
  }, [date]);

  // Refresh when the screen regains focus. / フォーカス復帰時に更新。
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  // Guard against missing params. / パラメータ欠如の防止。
  if (!date) return null;

  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <BackButton />
        <View style={styles.headerRow}>
          <Text style={styles.title}>{date}</Text>
        </View>

        <SurfaceCard style={styles.card}>
          <Text style={styles.sectionTitle}>{t('dayDetail.statusTitle')}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.bodyText}>
              {t('common.morning')}: {morningDone ? t('common.done') : t('common.incomplete')}
            </Text>
            <AppIcon
              name={morningDone ? 'check' : 'uncheck'}
              size={16}
              color={morningDone ? theme.colors.accentDark : theme.colors.inkMuted}
            />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.bodyText}>
              {t('common.night')}: {nightDone ? t('common.done') : t('common.incomplete')}
            </Text>
            <AppIcon
              name={nightDone ? 'check' : 'uncheck'}
              size={16}
              color={nightDone ? theme.colors.accentDark : theme.colors.inkMuted}
            />
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.card}>
          <Text style={styles.sectionTitle}>{t('dayDetail.noteTitle')}</Text>
          {note.trim().length > 0 ? (
            <Text style={styles.bodyText}>{note}</Text>
          ) : (
            <Text style={styles.mutedText}>{t('dayDetail.noteEmpty')}</Text>
          )}
        </SurfaceCard>

        <View style={styles.rowButtons}>
          <AppButton
            label={t('dayDetail.goMorning')}
            onPress={() => router.push({ pathname: '/morning', params: { date } })}
            variant="primary"
            style={styles.primaryButton}
          />
          <AppButton
            label={t('dayDetail.goNight')}
            onPress={() => router.push({ pathname: '/night', params: { date } })}
            variant="primary"
            style={styles.primaryButton}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

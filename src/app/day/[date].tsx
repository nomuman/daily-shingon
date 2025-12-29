import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { parseISODateLocal } from '../../lib/date';
import { getMorningLog, isMorningComplete } from '../../lib/morningLog';
import { getNightLog, isNightComplete } from '../../lib/nightLog';
import { cardShadow, theme } from '../../ui/theme';

export default function DayDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { date } = useLocalSearchParams<{ date?: string }>();

  const [morningDone, setMorningDone] = useState(false);
  const [nightDone, setNightDone] = useState(false);
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    if (!date) return;
    const day = parseISODateLocal(date);

    const morning = await getMorningLog(day);
    const night = await getNightLog(day);

    setMorningDone(isMorningComplete(morning));
    setNightDone(isNightComplete(night));
    setNote(night?.note ?? '');
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!date) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{date}</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
          >
            <Text style={styles.ghostButtonText}>{t('common.back')}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('dayDetail.statusTitle')}</Text>
          <Text style={styles.bodyText}>
            {t('common.morning')}: {morningDone ? t('common.doneEmoji') : t('common.dash')}
          </Text>
          <Text style={styles.bodyText}>
            {t('common.night')}: {nightDone ? t('common.doneEmoji') : t('common.dash')}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('dayDetail.noteTitle')}</Text>
          {note.trim().length > 0 ? (
            <Text style={styles.bodyText}>{note}</Text>
          ) : (
            <Text style={styles.mutedText}>{t('dayDetail.noteEmpty')}</Text>
          )}
        </View>

        <View style={styles.rowButtons}>
          <Pressable
            onPress={() => router.push('/morning')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonText}>{t('dayDetail.goMorning')}</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/night')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonText}>{t('dayDetail.goNight')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  },
  title: {
    fontSize: 18,
    fontFamily: theme.font.display,
    color: theme.colors.ink,
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
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
    ...cardShadow,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  bodyText: {
    color: theme.colors.ink,
    lineHeight: 20,
    fontFamily: theme.font.body,
  },
  mutedText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  primaryButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ink,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontWeight: '700',
    fontFamily: theme.font.body,
  },
});

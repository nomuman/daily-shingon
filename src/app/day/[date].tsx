import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { AppIcon } from '../../components/AppIcon';
import { parseISODateLocal } from '../../lib/date';
import { getMorningLog, isMorningComplete } from '../../lib/morningLog';
import { getNightLog, isNightComplete } from '../../lib/nightLog';
import { useTheme, useThemedStyles } from '../../ui/theme';

export default function DayDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useThemedStyles((theme, cardShadow) =>
    StyleSheet.create({
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
        gap: theme.spacing.sm,
      },
      title: {
        fontSize: 18,
        fontFamily: theme.font.display,
        color: theme.colors.ink,
      },
      ghostButton: {
        minHeight: 36,
        paddingHorizontal: 12,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      },
      ghostButtonPressed: {
        opacity: 0.85,
      },
      ghostButtonText: {
        color: theme.colors.ink,
        fontFamily: theme.font.body,
        fontWeight: '600',
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
        minHeight: 44,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.ink,
      },
      primaryButtonPressed: {
        opacity: 0.85,
      },
      primaryButtonText: {
        color: theme.colors.surface,
        fontFamily: theme.font.body,
        fontWeight: '700',
      },
    }),
  );
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

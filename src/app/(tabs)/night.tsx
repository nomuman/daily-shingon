import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { AppIcon } from '../../components/AppIcon';
import ErrorState from '../../components/ErrorState';
import { getDayCard } from '../../content/curriculum30';
import { useContentLang } from '../../content/useContentLang';
import { clearNightLog, getNightLog, isNightComplete, setNightLog } from '../../lib/nightLog';
import { getProgramDayInfo } from '../../lib/programDay';
import { useTheme, useThemedStyles, type CardShadow, type Theme } from '../../ui/theme';

type CheckKey = 'sange' | 'hotsugan' | 'ekou';

export default function NightScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const contentLang = useContentLang();

  const [loading, setLoading] = useState(true);

  const [dayTitle, setDayTitle] = useState<string>('');
  const [nightQuestion, setNightQuestion] = useState<string>('');

  const [sangeDone, setSangeDone] = useState(false);
  const [hotsuganDone, setHotsuganDone] = useState(false);
  const [ekouDone, setEkouDone] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getProgramDayInfo();
      const card = getDayCard(contentLang, info.dayNumber);
      setDayTitle(card.title);
      setNightQuestion(card.nightQuestion);

      const saved = await getNightLog();
      if (saved) {
        setSangeDone(saved.sangeDone);
        setHotsuganDone(saved.hotsuganDone);
        setEkouDone(saved.ekouDone);
        setNote(saved.note ?? '');
      }
    } catch {
      setError(t('errors.nightLoadFail'));
    } finally {
      setLoading(false);
    }
  }, [contentLang, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const complete = useMemo(() => {
    return isNightComplete({
      dateISO: 'today',
      sangeDone,
      hotsuganDone,
      ekouDone,
      note,
      savedAtISO: '',
    });
  }, [sangeDone, hotsuganDone, ekouDone, note]);

  const toggle = (k: CheckKey) => {
    if (k === 'sange') setSangeDone((v) => !v);
    if (k === 'hotsugan') setHotsuganDone((v) => !v);
    if (k === 'ekou') setEkouDone((v) => !v);
  };

  const Item = ({
    title,
    desc,
    checked,
    onPress,
  }: {
    title: string;
    desc: string;
    checked: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: checked }}
      style={({ pressed }) => [
        styles.checkItem,
        checked && styles.checkItemSelected,
        pressed && styles.checkItemPressed,
      ]}
    >
      <View style={styles.checkTitleRow}>
        <AppIcon
          name={checked ? 'check' : 'uncheck'}
          size={18}
          color={checked ? theme.colors.accentDark : theme.colors.inkMuted}
        />
        <Text style={[styles.checkTitle, checked && styles.checkTitleSelected]}>{title}</Text>
      </View>
      <Text style={styles.checkDesc}>{desc}</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('night.title')}</Text>

        <View style={styles.card}>
          <Text style={styles.kicker}>{t('night.todayLearn')}</Text>
          <Text style={styles.cardTitle}>{dayTitle}</Text>

          <Text style={styles.sectionTitle}>{t('night.nightQuestion')}</Text>
          <Text style={styles.bodyText}>{nightQuestion}</Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusText}>
              {t('common.statusWithValue', {
                value: complete ? t('common.done') : t('common.incomplete'),
              })}
            </Text>
            <AppIcon
              name={complete ? 'check' : 'uncheck'}
              size={16}
              color={complete ? theme.colors.accentDark : theme.colors.inkMuted}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('night.stepsTitle')}</Text>

          <Item
            title={t('night.steps.sange.title')}
            desc={t('night.steps.sange.desc')}
            checked={sangeDone}
            onPress={() => toggle('sange')}
          />
          <Item
            title={t('night.steps.hotsugan.title')}
            desc={t('night.steps.hotsugan.desc')}
            checked={hotsuganDone}
            onPress={() => toggle('hotsugan')}
          />
          <Item
            title={t('night.steps.ekou.title')}
            desc={t('night.steps.ekou.desc')}
            checked={ekouDone}
            onPress={() => toggle('ekou')}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('night.noteTitle')}</Text>
          <Text style={styles.mutedText}>{t('night.noteHint')}</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t('night.notePlaceholder')}
            placeholderTextColor={theme.colors.inkMuted}
            multiline
            style={styles.noteInput}
          />
        </View>

        <Pressable
          onPress={async () => {
            try {
              await setNightLog({ sangeDone, hotsuganDone, ekouDone, note });
              router.replace('/');
            } catch {
              setError(t('errors.saveFail'));
            }
          }}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>{t('night.saveButton')}</Text>
        </Pressable>

        <Pressable
          onPress={async () => {
            try {
              await clearNightLog();
              setSangeDone(false);
              setHotsuganDone(false);
              setEkouDone(false);
              setNote('');
            } catch {
              setError(t('errors.updateFail'));
            }
          }}
          style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
        >
          <Text style={styles.ghostButtonText}>{t('night.resetButton')}</Text>
        </Pressable>

        <Text style={styles.footerNote}>{t('night.footerNote')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme, cardShadow: CardShadow) =>
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
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
    },
    kicker: {
      fontSize: 12,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    card: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
      ...cardShadow,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    bodyText: {
      lineHeight: 20,
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    mutedText: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    statusText: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    statusRow: {
      marginTop: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    checkItem: {
      minHeight: 44,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    checkItemSelected: {
      borderColor: theme.colors.ink,
      borderWidth: 2,
    },
    checkItemPressed: {
      opacity: 0.85,
    },
    checkTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    checkTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    checkTitleSelected: {
      fontWeight: '700',
    },
    checkDesc: {
      marginTop: 6,
      color: theme.colors.inkMuted,
      lineHeight: 20,
      fontFamily: theme.font.body,
    },
    noteInput: {
      minHeight: 90,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: 12,
      textAlignVertical: 'top',
      backgroundColor: theme.colors.surface,
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    primaryButton: {
      minHeight: 48,
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
    ghostButton: {
      minHeight: 46,
      paddingHorizontal: 14,
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
      fontWeight: '700',
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    footerNote: {
      fontSize: 12,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
  });

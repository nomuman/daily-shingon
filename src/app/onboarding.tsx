/**
 * Purpose: First-run onboarding flow that explains the app concept and tone. / 目的: アプリの考え方とトーンを伝える初回オンボーディング。
 * Responsibilities: show three short onboarding steps and persist completion. / 役割: 3枚の短いステップ表示と完了状態の保存。
 * Inputs: translations, theme tokens, and onboarding completion storage. / 入力: 翻訳文言、テーマ、オンボーディング保存状態。
 * Outputs: onboarding UI and navigation to the main app. / 出力: オンボーディングUIと本編への遷移。
 * Dependencies: Expo Router, shared buttons/cards, onboarding storage helper. / 依存: Expo Router、共通ボタン/カード、オンボーディング保存ヘルパー。
 * Side effects: writes onboarding completion flag. / 副作用: オンボーディング完了フラグの保存。
 * Edge cases: save failure shows an inline error and keeps the user on the final step. / 例外: 保存失敗時は最終ステップでエラー表示。
 */
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import SurfaceCard from '../components/SurfaceCard';
import { completeOnboarding } from '../lib/onboarding';
import { useResponsiveLayout } from '../ui/responsive';
import { useThemedStyles, type CardShadow, type Theme } from '../ui/theme';

type StepId = 'concept' | 'sanmitsu' | 'return';

type OnboardingStep = {
  id: StepId;
  kicker: string;
  title: string;
  body: string;
  note: string;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();

  const steps = useMemo<OnboardingStep[]>(
    () => [
      {
        id: 'concept',
        kicker: t('onboarding.steps.concept.kicker'),
        title: t('onboarding.steps.concept.title'),
        body: t('onboarding.steps.concept.body'),
        note: t('onboarding.steps.concept.note'),
      },
      {
        id: 'sanmitsu',
        kicker: t('onboarding.steps.sanmitsu.kicker'),
        title: t('onboarding.steps.sanmitsu.title'),
        body: t('onboarding.steps.sanmitsu.body'),
        note: t('onboarding.steps.sanmitsu.note'),
      },
      {
        id: 'return',
        kicker: t('onboarding.steps.return.kicker'),
        title: t('onboarding.steps.return.title'),
        body: t('onboarding.steps.return.body'),
        note: t('onboarding.steps.return.note'),
      },
    ],
    [t],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const handleNext = async () => {
    if (!isLastStep) {
      setError(null);
      setStepIndex((value) => value + 1);
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      await completeOnboarding();
      router.replace('/(tabs)');
    } catch {
      setError(t('onboarding.saveFail'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>{t('onboarding.kicker')}</Text>
          <Text style={styles.heroTitle}>{t('app.name')}</Text>
          <Text style={styles.heroBody}>{t('onboarding.intro')}</Text>
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressRow}>
            {steps.map((step, index) => (
              <View
                key={step.id}
                style={[styles.progressPill, index <= stepIndex && styles.progressPillActive]}
              />
            ))}
          </View>
          <Text style={styles.progressLabel}>
            {t('onboarding.progress', { current: stepIndex + 1, total: steps.length })}
          </Text>
        </View>

        <SurfaceCard style={styles.card}>
          <Text style={styles.cardKicker}>{currentStep.kicker}</Text>
          <Text style={styles.cardTitle}>{currentStep.title}</Text>
          <Text style={styles.cardBody}>{currentStep.body}</Text>

          {currentStep.id === 'sanmitsu' && (
            <View style={styles.sanmitsuStack}>
              <View style={styles.sanmitsuRow}>
                <View style={[styles.sanmitsuDot, styles.sanmitsuDotBody]} />
                <View style={styles.sanmitsuTextBlock}>
                  <Text style={styles.sanmitsuTitle}>{t('onboarding.sanmitsu.body.title')}</Text>
                  <Text style={styles.sanmitsuBody}>{t('onboarding.sanmitsu.body.body')}</Text>
                </View>
              </View>
              <View style={styles.sanmitsuRow}>
                <View style={[styles.sanmitsuDot, styles.sanmitsuDotSpeech]} />
                <View style={styles.sanmitsuTextBlock}>
                  <Text style={styles.sanmitsuTitle}>{t('onboarding.sanmitsu.speech.title')}</Text>
                  <Text style={styles.sanmitsuBody}>{t('onboarding.sanmitsu.speech.body')}</Text>
                </View>
              </View>
              <View style={styles.sanmitsuRow}>
                <View style={[styles.sanmitsuDot, styles.sanmitsuDotMind]} />
                <View style={styles.sanmitsuTextBlock}>
                  <Text style={styles.sanmitsuTitle}>{t('onboarding.sanmitsu.mind.title')}</Text>
                  <Text style={styles.sanmitsuBody}>{t('onboarding.sanmitsu.mind.body')}</Text>
                </View>
              </View>
            </View>
          )}

          <SurfaceCard style={styles.noteCard} elevated={false} variant="muted" padding="md">
            <Text style={styles.noteText}>{currentStep.note}</Text>
          </SurfaceCard>

          {!!error && (
            <SurfaceCard style={styles.errorCard} elevated={false} variant="muted" padding="sm">
              <Text style={styles.errorText}>{error}</Text>
            </SurfaceCard>
          )}
        </SurfaceCard>

        <View style={styles.footer}>
          <AppButton
            label={t('common.back')}
            variant="ghost"
            size="md"
            disabled={stepIndex === 0 || submitting}
            style={styles.secondaryButton}
            onPress={() => {
              if (stepIndex === 0) return;
              setError(null);
              setStepIndex((value) => value - 1);
            }}
          />
          <AppButton
            label={isLastStep ? t('common.start') : t('common.next')}
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={submitting}
            style={styles.primaryButton}
            onPress={() => {
              void handleNext();
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (theme: Theme, cardShadow: CardShadow) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.lg,
      paddingBottom: 40,
      gap: theme.spacing.lg,
      justifyContent: 'space-between',
    },
    hero: {
      gap: theme.spacing.xs,
      paddingTop: theme.spacing.sm,
    },
    heroKicker: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    heroTitle: {
      fontSize: 30,
      lineHeight: 38,
      color: theme.colors.ink,
      fontFamily: theme.font.display,
      letterSpacing: 0.8,
    },
    heroBody: {
      color: theme.colors.inkMuted,
      lineHeight: 22,
      fontFamily: theme.font.body,
    },
    progressBlock: {
      gap: theme.spacing.xs,
    },
    progressRow: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    progressPill: {
      flex: 1,
      height: 6,
      borderRadius: 999,
      backgroundColor: theme.colors.border,
    },
    progressPillActive: {
      backgroundColor: theme.colors.accent,
    },
    progressLabel: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      fontSize: 12,
    },
    card: {
      gap: theme.spacing.md,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.accentSoft,
      ...cardShadow,
    },
    cardKicker: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: theme.colors.accentDark,
      fontFamily: theme.font.bodyBold,
    },
    cardTitle: {
      fontSize: 24,
      lineHeight: 32,
      color: theme.colors.ink,
      fontFamily: theme.font.display,
      letterSpacing: 0.4,
    },
    cardBody: {
      color: theme.colors.ink,
      lineHeight: 24,
      fontFamily: theme.font.body,
    },
    sanmitsuStack: {
      gap: theme.spacing.sm,
    },
    sanmitsuRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sanmitsuDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 6,
    },
    sanmitsuDotBody: {
      backgroundColor: theme.colors.accent,
    },
    sanmitsuDotSpeech: {
      backgroundColor: theme.colors.success,
    },
    sanmitsuDotMind: {
      backgroundColor: theme.colors.inkMuted,
    },
    sanmitsuTextBlock: {
      flex: 1,
      gap: 2,
    },
    sanmitsuTitle: {
      color: theme.colors.ink,
      fontFamily: theme.font.bodyBold,
      fontSize: 15,
    },
    sanmitsuBody: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      lineHeight: 20,
    },
    noteCard: {
      borderRadius: theme.radius.lg,
    },
    noteText: {
      color: theme.colors.ink,
      lineHeight: 22,
      fontFamily: theme.font.body,
    },
    errorCard: {
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.dangerSoft,
    },
    errorText: {
      color: theme.colors.danger,
      fontFamily: theme.font.body,
      lineHeight: 20,
    },
    footer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'center',
    },
    secondaryButton: {
      flex: 0.9,
    },
    primaryButton: {
      flex: 1.4,
    },
  });

/**
 * Purpose: Open-source licenses screen. / 目的: OSSライセンス一覧画面。
 * Responsibilities: render OSS license list and allow back navigation. / 役割: ライセンス一覧表示と戻る操作。
 * Inputs: OSS_LICENSES data and translations. / 入力: OSSライセンスデータ、翻訳文言。
 * Outputs: license list UI. / 出力: ライセンス一覧UI。
 * Dependencies: content list, Expo Router, theme system, i18n. / 依存: コンテンツリスト、Expo Router、テーマシステム、i18n。
 * Side effects: none (navigation only). / 副作用: なし（遷移のみ）。
 * Edge cases: empty license list. / 例外: ライセンスが空。
 */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { OSS_LICENSES } from '../content/oss-licenses';
import { useThemedStyles, type CardShadow, type Theme } from '../ui/theme';

export default function LicensesScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{t('licenses.title')}</Text>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
            >
              <Text style={styles.ghostButtonText}>{t('common.back')}</Text>
            </Pressable>
          </View>
          <Text style={styles.headerBody}>{t('licenses.subtitle')}</Text>
        </View>

        <View style={styles.listCard}>
          {OSS_LICENSES.length === 0 ? (
            <Text style={styles.emptyText}>{t('licenses.empty')}</Text>
          ) : (
            OSS_LICENSES.map((entry, index) => (
              <View
                key={`${entry.name}@${entry.version ?? 'unknown'}`}
                style={[styles.licenseRow, index > 0 && styles.licenseRowDivider]}
              >
                <View style={styles.licenseText}>
                  <Text style={styles.licenseName}>{entry.name}</Text>
                  {!!entry.version && (
                    <Text style={styles.licenseMeta}>{t('licenses.version', { v: entry.version })}</Text>
                  )}
                </View>
                <View style={styles.licenseBadge}>
                  <Text style={styles.licenseBadgeText}>{entry.license}</Text>
                </View>
              </View>
            ))
          )}
        </View>
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
      gap: theme.spacing.sm,
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
      lineHeight: 24,
    },
    headerBody: {
      color: theme.colors.inkMuted,
      lineHeight: 20,
      fontFamily: theme.font.body,
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
    listCard: {
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      ...cardShadow,
    },
    licenseRow: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    licenseRowDivider: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    licenseText: {
      flex: 1,
      gap: 2,
    },
    licenseName: {
      color: theme.colors.ink,
      fontFamily: theme.font.body,
      fontSize: 15,
    },
    licenseMeta: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      fontSize: 12,
    },
    licenseBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
    },
    licenseBadgeText: {
      color: theme.colors.accentDark,
      fontFamily: theme.font.body,
      fontWeight: '700',
      fontSize: 12,
    },
    emptyText: {
      padding: theme.spacing.md,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
  });

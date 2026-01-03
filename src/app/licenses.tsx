/**
 * Purpose: Open-source licenses screen. / 目的: OSSライセンス一覧画面。
 * Responsibilities: render OSS license list and allow back navigation. / 役割: ライセンス一覧表示と戻る操作。
 * Inputs: OSS_LICENSES data and translations. / 入力: OSSライセンスデータ、翻訳文言。
 * Outputs: license list UI. / 出力: ライセンス一覧UI。
 * Dependencies: content list, Expo Router, theme system, i18n. / 依存: コンテンツリスト、Expo Router、テーマシステム、i18n。
 * Side effects: none (navigation only). / 副作用: なし（遷移のみ）。
 * Edge cases: empty license list. / 例外: ライセンスが空。
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';
import Screen from '../components/Screen';
import SurfaceCard from '../components/SurfaceCard';
import { OSS_LICENSES } from '../content/oss-licenses';
import { useResponsiveLayout } from '../ui/responsive';
import { useThemedStyles, type Theme } from '../ui/theme';

export default function LicensesScreen() {
  const { t } = useTranslation('common');
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();

  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <BackButton />
        <SurfaceCard style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{t('licenses.title')}</Text>
          </View>
          <Text style={styles.headerBody}>{t('licenses.subtitle')}</Text>
        </SurfaceCard>

        <SurfaceCard style={styles.listCard} padding={0} variant="outlined">
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
        </SurfaceCard>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
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
    headerCard: {
      borderRadius: theme.radius.xl,
      gap: theme.spacing.sm,
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
      lineHeight: 26,
      letterSpacing: 0.3,
    },
    headerBody: {
      color: theme.colors.inkMuted,
      lineHeight: 22,
      fontFamily: theme.font.body,
    },
    listCard: {
      borderRadius: theme.radius.lg,
      overflow: 'hidden',
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
      fontFamily: theme.font.bodyBold,
      fontSize: 12,
    },
    emptyText: {
      padding: theme.spacing.md,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
  });

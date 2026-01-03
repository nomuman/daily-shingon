/**
 * Purpose: Roadmap & changelog screen. / 目的: ロードマップと更新情報をまとめて表示する画面。
 * Responsibilities: render roadmap chips, changelog entries, and back navigation. / 役割: ロードマップ/更新情報の表示と戻る操作。
 * Inputs: updates content, theme tokens, translations. / 入力: 更新データ、テーマトークン、翻訳文言。
 * Outputs: roadmap/changelog UI. / 出力: ロードマップ/更新情報UI。
 * Dependencies: content loader, Expo Router, theme system, i18n. / 依存: コンテンツローダー、Expo Router、テーマ、i18n。
 * Side effects: none (navigation only). / 副作用: なし（遷移のみ）。
 * Edge cases: empty lists render placeholders. / 例外: データなし時は空状態を表示。
 */
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';
import Screen from '../components/Screen';
import SurfaceCard from '../components/SurfaceCard';
import { getUpdatesContent, type RoadmapStatus } from '../content/updates';
import { useContentLang } from '../content/useContentLang';
import { useResponsiveLayout } from '../ui/responsive';
import { useThemedStyles, type Theme } from '../ui/theme';

export default function UpdatesScreen() {
  const { t } = useTranslation('common');
  const lang = useContentLang();
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();
  const content = getUpdatesContent(lang);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const selectedRoadmap = content.roadmap.find((item) => item.id === selectedRoadmapId) ?? null;

  const statusLabel = (status: RoadmapStatus) => t(`updates.roadmap.status.${status}`);
  const chipStyleForStatus = (status: RoadmapStatus) => {
    if (status === 'idea') return styles.roadmapChipIdea;
    if (status === 'beta') return styles.roadmapChipBeta;
    if (status === 'done') return styles.roadmapChipDone;
    return styles.roadmapChipWip;
  };
  const statusBadgeStyle = (status: RoadmapStatus) => {
    if (status === 'idea') return styles.roadmapStatusIdea;
    if (status === 'beta') return styles.roadmapStatusBeta;
    if (status === 'done') return styles.roadmapStatusDone;
    return styles.roadmapStatusWip;
  };
  const statusTextStyle = (status: RoadmapStatus) => {
    if (status === 'idea') return styles.roadmapStatusTextIdea;
    if (status === 'beta') return styles.roadmapStatusTextBeta;
    if (status === 'done') return styles.roadmapStatusTextDone;
    return styles.roadmapStatusTextWip;
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, responsive.contentStyle]}
      >
        <BackButton />
        <SurfaceCard style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{t('updates.title')}</Text>
          </View>
          <Text style={styles.headerBody}>{t('updates.subtitle')}</Text>
        </SurfaceCard>

        <SurfaceCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('updates.roadmap.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('updates.roadmap.body')}</Text>
          {content.roadmap.length === 0 ? (
            <Text style={styles.emptyText}>{t('updates.roadmap.empty')}</Text>
          ) : (
            <View style={styles.roadmapWrap}>
              {content.roadmap.map((item) => {
                const status = item.status ?? 'wip';
                const isSelected = selectedRoadmapId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                    onPress={() => setSelectedRoadmapId(isSelected ? null : item.id)}
                    style={({ pressed }) => [
                      styles.roadmapChip,
                      chipStyleForStatus(status),
                      isSelected && styles.roadmapChipSelected,
                      pressed && styles.roadmapChipPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roadmapChipText,
                        status === 'done' && styles.roadmapChipTextDone,
                      ]}
                    >
                      {item.title}
                    </Text>
                    {item.status && (
                      <View style={[styles.roadmapStatus, statusBadgeStyle(status)]}>
                        <Text style={[styles.roadmapStatusText, statusTextStyle(status)]}>
                          {statusLabel(status)}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {selectedRoadmap ? (
            <SurfaceCard style={styles.detailCard} padding="md" elevated={false} variant="muted">
              <View style={styles.detailHeader}>
                <Text style={styles.detailTitle}>{t('updates.roadmap.detailTitle')}</Text>
                {!!selectedRoadmap.status && (
                  <View style={[styles.detailStatus, statusBadgeStyle(selectedRoadmap.status)]}>
                    <Text style={[styles.detailStatusText, statusTextStyle(selectedRoadmap.status)]}>
                      {statusLabel(selectedRoadmap.status)}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.detailItemTitle}>{selectedRoadmap.title}</Text>
              <Text style={styles.detailBody}>{selectedRoadmap.detail}</Text>
            </SurfaceCard>
          ) : (
            <Text style={styles.detailHint}>{t('updates.roadmap.detailHint')}</Text>
          )}
        </SurfaceCard>

        <SurfaceCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('updates.changelog.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('updates.changelog.body')}</Text>
          {content.changelog.length === 0 ? (
            <Text style={styles.emptyText}>{t('updates.changelog.empty')}</Text>
          ) : (
            <View style={styles.changelogList}>
              {content.changelog.map((entry, index) => (
                <View key={entry.id} style={styles.changelogItem}>
                  <View style={styles.changelogMetaRow}>
                    <View style={styles.changelogMetaLeft}>
                      {index > 0 && <View style={styles.changelogLine} />}
                      <View style={styles.changelogDot} />
                    </View>
                    <View style={styles.changelogMetaText}>
                      <Text style={styles.changelogDate}>{entry.dateLabel}</Text>
                      {!!entry.tag && <Text style={styles.changelogTag}>{entry.tag}</Text>}
                    </View>
                  </View>

                  <SurfaceCard
                    style={styles.changelogCard}
                    padding="md"
                    elevated={false}
                    variant="outlined"
                  >
                    <Text style={styles.changelogTitle}>{entry.title}</Text>
                    <Text style={styles.changelogBody}>{entry.body}</Text>
                    {!!entry.badges?.length && (
                      <View style={styles.changelogBadgeRow}>
                        {entry.badges.map((badge) => (
                          <View key={badge} style={styles.changelogBadge}>
                            <Text style={styles.changelogBadgeText}>{badge}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </SurfaceCard>
                </View>
              ))}
            </View>
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
    sectionCard: {
      gap: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.ink,
      fontFamily: theme.font.display,
    },
    sectionSubtitle: {
      color: theme.colors.inkMuted,
      lineHeight: 20,
      fontFamily: theme.font.body,
    },
    emptyText: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      paddingTop: theme.spacing.sm,
    },
    roadmapWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      paddingTop: theme.spacing.sm,
    },
    roadmapChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    roadmapChipPressed: {
      opacity: 0.85,
    },
    roadmapChipSelected: {
      borderColor: theme.colors.accent,
    },
    roadmapChipWip: {
      borderColor: theme.colors.accentSoft,
      backgroundColor: theme.colors.surface,
    },
    roadmapChipBeta: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceMuted,
    },
    roadmapChipIdea: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      borderStyle: 'dashed',
    },
    roadmapChipDone: {
      borderColor: theme.colors.successSoft,
      backgroundColor: theme.colors.surface,
    },
    roadmapChipText: {
      fontSize: 13,
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    roadmapChipTextDone: {
      color: theme.colors.inkMuted,
    },
    roadmapStatus: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
    },
    roadmapStatusWip: {
      backgroundColor: theme.colors.accentSoft,
    },
    roadmapStatusBeta: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    roadmapStatusIdea: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
    },
    roadmapStatusDone: {
      backgroundColor: theme.colors.successSoft,
    },
    roadmapStatusText: {
      fontSize: 11,
      fontWeight: '700',
      fontFamily: theme.font.body,
    },
    roadmapStatusTextWip: {
      color: theme.colors.accentDark,
    },
    roadmapStatusTextBeta: {
      color: theme.colors.inkMuted,
    },
    roadmapStatusTextIdea: {
      color: theme.colors.inkMuted,
    },
    detailCard: {
      marginTop: theme.spacing.md,
      borderRadius: theme.radius.lg,
      gap: theme.spacing.sm,
    },
    detailHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    detailTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    detailStatus: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
    },
    detailStatusText: {
      fontSize: 11,
      fontWeight: '700',
      fontFamily: theme.font.body,
    },
    detailItemTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    detailBody: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      lineHeight: 20,
    },
    detailHint: {
      marginTop: theme.spacing.sm,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
    },
    roadmapStatusTextDone: {
      color: theme.colors.success,
    },
    changelogList: {
      gap: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    changelogItem: {
      gap: theme.spacing.sm,
    },
    changelogMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    changelogMetaLeft: {
      width: 18,
      alignItems: 'center',
    },
    changelogLine: {
      position: 'absolute',
      top: -18,
      bottom: 8,
      width: 1,
      backgroundColor: theme.colors.border,
    },
    changelogDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.accent,
    },
    changelogMetaText: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    changelogDate: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      fontSize: 12,
    },
    changelogTag: {
      color: theme.colors.accentDark,
      fontFamily: theme.font.body,
      fontWeight: '700',
      fontSize: 12,
    },
    changelogCard: {
      borderRadius: theme.radius.lg,
      gap: theme.spacing.sm,
    },
    changelogTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.ink,
      fontFamily: theme.font.body,
    },
    changelogBody: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      lineHeight: 20,
    },
    changelogBadgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    changelogBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.surfaceMuted,
    },
    changelogBadgeText: {
      fontSize: 11,
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      fontWeight: '600',
    },
  });

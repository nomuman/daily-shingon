/**
 * Purpose: Card pack list screen for browsing learn card packs. / 目的: 学びカードパック一覧画面。
 * Responsibilities: load packs for current content language and navigate to a pack detail list. / 役割: 現在言語のパック読込と詳細一覧への遷移。
 * Inputs: content language, card pack data, translations. / 入力: コンテンツ言語、カードパックデータ、翻訳文言。
 * Outputs: list UI with navigation on press. / 出力: 一覧UIとタップ時遷移。
 * Dependencies: content loaders, Expo Router, themed styles, i18n. / 依存: コンテンツローダー、Expo Router、テーマスタイル、i18n。
 * Side effects: none (navigation only). / 副作用: なし（遷移のみ）。
 * Edge cases: empty packs list. / 例外: パックが空。
 */
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import BackButton from '../../../../components/BackButton';
import { getCardPacks } from '../../../../content/cards';
import { useContentLang } from '../../../../content/useContentLang';
import { useThemedStyles, type CardShadow, type Theme } from '../../../../ui/theme';

export default function CardPackListScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const styles = useThemedStyles(createStyles);
  const lang = useContentLang();
  // Memoize content pack list per language. / 言語ごとのパック一覧をメモ化。
  const packs = useMemo(() => getCardPacks(lang), [lang]);

  // Render a virtualized list of packs with header copy. / ヘッダー付きの仮想化リストを描画。
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={packs}
        keyExtractor={(item) => item.packId}
        ListHeaderComponent={
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.title}>{t('learnCards.title')}</Text>
            <Text style={styles.subtitle}>{t('learnCards.subtitle')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/learn/cards/${item.packId}`)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {t('learnCards.count', { total: item.count })}
              {item.description ? ` ・ ${item.description}` : ''}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme, cardShadow: CardShadow) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 24,
      gap: theme.spacing.md,
    },
    header: {
      paddingTop: theme.spacing.sm,
      gap: 6,
    },
    title: {
      fontSize: 22,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
    },
    subtitle: {
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
    cardPressed: {
      opacity: 0.9,
    },
    cardTitle: {
      fontSize: 16,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
    },
    cardMeta: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      lineHeight: 20,
    },
  });

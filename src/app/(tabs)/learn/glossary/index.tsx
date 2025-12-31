/**
 * Purpose: Glossary list screen with search and category filtering. / 目的: 用語集の検索・カテゴリ絞り込み画面。
 * Responsibilities: load glossary by content language, filter by query/category, and navigate to detail pages. / 役割: 言語別用語集読込、検索/カテゴリで絞り込み、詳細へ遷移。
 * Inputs: glossary data, search query, active category, translations. / 入力: 用語集データ、検索語、選択カテゴリ、翻訳文言。
 * Outputs: filtered list UI + navigation on item press. / 出力: 絞り込み一覧UIと遷移。
 * Dependencies: content loaders, Expo Router, themed styles, i18n. / 依存: コンテンツローダー、Expo Router、テーマスタイル、i18n。
 * Side effects: none (pure UI + navigation intent). / 副作用: なし（UI/遷移のみ）。
 * Edge cases: empty taxonomy, empty query, missing category values. / 例外: 分類なし、検索語空、カテゴリ欠落。
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import BackButton from '../../../../components/BackButton';
import SearchInput from '../../../../components/SearchInput';
import TagRow from '../../../../components/TagRow';
import { getGlossary } from '../../../../content/glossary';
import { useContentLang } from '../../../../content/useContentLang';
import { useResponsiveLayout } from '../../../../ui/responsive';
import { useThemedStyles, type CardShadow, type Theme } from '../../../../ui/theme';

export default function GlossaryListScreen() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const styles = useThemedStyles(createStyles);
  const responsive = useResponsiveLayout();
  const lang = useContentLang();
  const glossary = useMemo(() => getGlossary(lang), [lang]);
  const [q, setQ] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Prefer taxonomy categories; fall back to unique categories from entries. / taxonomy優先、無ければエントリからカテゴリ抽出。
  const categories = useMemo(() => {
    const fromTaxonomy = glossary.taxonomy?.categories ?? [];
    if (fromTaxonomy.length) return fromTaxonomy;
    return Array.from(new Set(glossary.entries.map((e) => e.category).filter(Boolean))) as string[];
  }, [glossary]);

  // Filter entries by query (term/reading/short/definition) and active category. / 用語/読み/短文/定義とカテゴリで絞り込み。
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return glossary.entries.filter((e) => {
      const matchesQuery =
        !query ||
        e.term.toLowerCase().includes(query) ||
        (e.reading ?? '').toLowerCase().includes(query) ||
        e.short.toLowerCase().includes(query) ||
        e.definition.toLowerCase().includes(query);

      const matchesCategory = !activeCategory || e.category === activeCategory;

      return matchesQuery && matchesCategory;
    });
  }, [glossary, q, activeCategory]);

  // Render search, filter chips, and a virtualized list for performance. / 検索・タグ・仮想化リストを描画。
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={responsive.contentStyle}>
        <BackButton style={styles.backButton} />
      </View>
      <SearchInput
        value={q}
        onChangeText={setQ}
        placeholder={t('glossary.search')}
        containerStyle={responsive.contentStyle}
      />
      <TagRow
        tags={categories}
        activeTag={activeCategory}
        onSelect={setActiveCategory}
        allLabel={t('common.all')}
        containerStyle={responsive.contentStyle}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('glossary.title')}</Text>
            <Text style={styles.subtitle}>{t('glossary.subtitle')}</Text>
            <Text style={styles.meta}>{t('glossary.count', { total: filtered.length })}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/learn/glossary/${item.id}`)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Text style={styles.term}>{item.term}</Text>
            <Text style={styles.rowMeta}>
              {item.reading ? `${item.reading} ・ ` : ''}
              {item.category ?? ''}
            </Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.short}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={[styles.listContent, responsive.contentStyle]}
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
    backButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
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
    meta: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      fontSize: 12,
    },
    listContent: {
      paddingBottom: 32,
      gap: theme.spacing.md,
    },
    row: {
      padding: theme.spacing.lg,
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      gap: 6,
      ...cardShadow,
    },
    rowPressed: {
      opacity: 0.9,
    },
    term: {
      fontSize: 16,
      fontFamily: theme.font.display,
      color: theme.colors.ink,
    },
    rowMeta: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      fontSize: 12,
    },
    desc: {
      color: theme.colors.ink,
      fontFamily: theme.font.body,
      lineHeight: 20,
    },
  });

import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchInput from '../../../../components/SearchInput';
import TagRow from '../../../../components/TagRow';
import { getGlossary } from '../../../../content/glossary';
import { cardShadow, theme } from '../../../../ui/theme';

export default function GlossaryListScreen() {
  const router = useRouter();
  const glossary = useMemo(() => getGlossary(), []);
  const [q, setQ] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const fromTaxonomy = glossary.taxonomy?.categories ?? [];
    if (fromTaxonomy.length) return fromTaxonomy;
    return Array.from(
      new Set(glossary.entries.map((e) => e.category).filter(Boolean)),
    ) as string[];
  }, [glossary]);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SearchInput value={q} onChangeText={setQ} placeholder="用語検索（例：三密）" />
      <TagRow
        tags={categories}
        activeTag={activeCategory}
        onSelect={setActiveCategory}
        allLabel="全部"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>用語集</Text>
            <Text style={styles.subtitle}>わからない言葉をすぐ引ける</Text>
            <Text style={styles.meta}>{filtered.length} 件</Text>
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
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
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

import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchInput from '../../../../components/SearchInput';
import TagRow from '../../../../components/TagRow';
import { getPackById } from '../../../../content/cards';
import type { Card } from '../../../../content/types';
import { cardShadow, theme } from '../../../../ui/theme';

export default function CardListScreen() {
  const router = useRouter();
  const { packId } = useLocalSearchParams<{ packId?: string | string[] }>();
  const resolvedPackId = Array.isArray(packId) ? packId[0] : packId;
  const pack = resolvedPackId ? getPackById(resolvedPackId) : undefined;

  const [q, setQ] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    if (!pack) return [];
    return pack.cards.flatMap((c) => c.tags ?? []);
  }, [pack]);

  const filtered = useMemo(() => {
    if (!pack) return [];
    const query = q.trim().toLowerCase();

    return pack.cards.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query) ||
        c.summary.toLowerCase().includes(query) ||
        (c.tags ?? []).some((t) => t.toLowerCase().includes(query));

      const matchesTag = !activeTag || (c.tags ?? []).includes(activeTag);

      return matchesQuery && matchesTag;
    });
  }, [pack, q, activeTag]);

  if (!pack) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>packId が見つからない: {resolvedPackId ?? 'unknown'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SearchInput value={q} onChangeText={setQ} placeholder="カード検索" />
      <TagRow tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{pack.meta.title}</Text>
            {!!pack.meta.description && <Text style={styles.subtitle}>{pack.meta.description}</Text>}
            <Text style={styles.meta}>
              {filtered.length} / {pack.cards.length} 枚
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CardRow
            card={item}
            onPress={() => router.push(`/learn/cards/${pack.meta.pack_id}/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

function CardRow({ card, onPress }: { card: Card; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Text style={styles.rowTitle}>{card.title}</Text>
      <Text style={styles.rowMeta}>
        {card.type === 'learn' ? '学び' : '実践'} ・ {levelLabel(card.level)}
      </Text>
      <Text style={styles.rowSummary} numberOfLines={2}>
        {card.summary}
      </Text>
    </Pressable>
  );
}

function levelLabel(level: Card['level']) {
  switch (level) {
    case 'beginner':
      return '初級';
    case 'intermediate':
      return '中級';
    case 'advanced':
      return '上級';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    gap: 6,
  },
  title: {
    fontSize: 20,
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
  rowTitle: {
    fontSize: 16,
    fontFamily: theme.font.display,
    color: theme.colors.ink,
  },
  rowMeta: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
    fontSize: 12,
  },
  rowSummary: {
    color: theme.colors.ink,
    fontFamily: theme.font.body,
    lineHeight: 20,
  },
});

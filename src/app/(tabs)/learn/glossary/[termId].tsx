import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getGlossary, getGlossaryEntry } from '../../../../content/glossary';
import { cardShadow, theme } from '../../../../ui/theme';

export default function GlossaryDetailScreen() {
  const { termId } = useLocalSearchParams<{ termId?: string | string[] }>();
  const resolvedTermId = Array.isArray(termId) ? termId[0] : termId;
  const glossary = getGlossary();
  const entry = resolvedTermId ? getGlossaryEntry(resolvedTermId) : undefined;

  if (!entry) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>用語が見つからない: {resolvedTermId ?? 'unknown'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{entry.term}</Text>
          <Text style={styles.meta}>
            {entry.reading ? `${entry.reading} ・ ` : ''}
            {entry.category ?? ''}
            {entry.level ? ` ・ ${levelLabel(entry.level)}` : ''}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>短い説明</Text>
          <Text style={styles.bodyText}>{entry.short}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>定義</Text>
          <Text style={styles.bodyText}>{entry.definition}</Text>
        </View>

        {!!entry.notes && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>補足</Text>
            <Text style={styles.bodyText}>{entry.notes}</Text>
          </View>
        )}

        {!!entry.see_also?.length && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>関連</Text>
            {entry.see_also.map((id) => (
              <Text key={id} style={styles.bodyText}>
                ・{id}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>出典</Text>
          {entry.sources.map((key) => {
            const ref = glossary.bibliography?.[key];
            return (
              <Text key={key} style={styles.bodyText}>
                ・{key}
                {ref?.title ? `：${ref.title}` : ''}
                {ref?.url ? `（${ref.url}）` : ''}
              </Text>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function levelLabel(level: 'beginner' | 'intermediate' | 'advanced') {
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
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
    gap: theme.spacing.md,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontFamily: theme.font.display,
    color: theme.colors.ink,
  },
  meta: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  bodyText: {
    lineHeight: 22,
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
  emptyState: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.font.body,
  },
});

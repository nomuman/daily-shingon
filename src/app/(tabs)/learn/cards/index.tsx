import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getCardPacks } from '../../../../content/cards';
import { cardShadow, theme } from '../../../../ui/theme';

export default function CardPackListScreen() {
  const router = useRouter();
  const packs = useMemo(() => getCardPacks(), []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={packs}
        keyExtractor={(item) => item.packId}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>学びカード</Text>
            <Text style={styles.subtitle}>短い学び + 行い + 問い</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/learn/cards/${item.packId}`)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {item.count}枚{item.description ? ` ・ ${item.description}` : ''}
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

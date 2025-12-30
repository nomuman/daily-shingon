import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useThemedStyles } from '../ui/theme';

type TagRowProps = {
  tags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
  allLabel?: string;
};

export default function TagRow({ tags, activeTag, onSelect, allLabel }: TagRowProps) {
  const { t } = useTranslation('common');
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      wrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
      },
      chip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      },
      chipActive: {
        backgroundColor: theme.colors.ink,
        borderColor: theme.colors.ink,
      },
      chipPressed: {
        opacity: 0.85,
      },
      chipText: {
        fontSize: 12,
        color: theme.colors.inkMuted,
        fontFamily: theme.font.body,
      },
      chipTextActive: {
        color: theme.colors.surface,
        fontWeight: '600',
      },
    }),
  );
  if (!tags.length) return null;

  const unique = Array.from(new Set(tags));

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => onSelect(null)}
        style={({ pressed }) => [
          styles.chip,
          !activeTag && styles.chipActive,
          pressed && styles.chipPressed,
        ]}
      >
        <Text style={[styles.chipText, !activeTag && styles.chipTextActive]}>
          {allLabel ?? t('common.all')}
        </Text>
      </Pressable>

      {unique.map((tag) => {
        const isActive = activeTag === tag;
        return (
          <Pressable
            key={tag}
            onPress={() => onSelect(isActive ? null : tag)}
            style={({ pressed }) => [
              styles.chip,
              isActive && styles.chipActive,
              pressed && styles.chipPressed,
            ]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{tag}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

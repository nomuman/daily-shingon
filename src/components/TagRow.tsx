/**
 * Purpose: Horizontal wrap of filter chips with an "All" option. / 目的: 「全部」付きのフィルターチップ行。
 * Responsibilities: render tags, highlight active selection, and emit selection changes. / 役割: タグ表示、選択強調、選択変更の通知。
 * Inputs: tags list, active tag, selection handler, optional all-label. / 入力: タグ一覧、選択中タグ、選択ハンドラ、任意の全件ラベル。
 * Outputs: chip row UI. / 出力: チップ行UI。
 * Dependencies: i18n copy, theme tokens. / 依存: i18n文言、テーマトークン。
 * Side effects: none (delegates selection via onSelect). / 副作用: なし（選択はコールバックへ）。
 * Edge cases: empty tags list (renders nothing). / 例外: タグが空の場合は描画しない。
 */
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useThemedStyles } from '../ui/theme';

type TagRowProps = {
  tags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
  allLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function TagRow({
  tags,
  activeTag,
  onSelect,
  allLabel,
  containerStyle,
}: TagRowProps) {
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

  // Deduplicate tags while preserving insertion order. / 追加順を保ってタグを重複排除。
  const unique = Array.from(new Set(tags));

  return (
    <View style={[styles.wrap, containerStyle]}>
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

/**
 * Purpose: Unified card surface with consistent padding and shadow. / 目的: 余白と影を統一したカード面。
 * Responsibilities: render themed surface container. / 役割: テーマ適用のカード容器表示。
 * Inputs: children, variant, padding, style overrides. / 入力: 子要素、バリアント、パディング、上書きスタイル。
 * Outputs: card wrapper view. / 出力: カードのラッパー。
 * Dependencies: theme tokens. / 依存: テーマトークン。
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemedStyles } from '../ui/theme';

type CardVariant = 'default' | 'muted' | 'outlined';
type CardPadding = 'sm' | 'md' | 'lg';

type SurfaceCardProps = {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding | number;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function SurfaceCard({
  children,
  variant = 'default',
  padding = 'lg',
  elevated = true,
  style,
}: SurfaceCardProps) {
  const styles = useThemedStyles((theme, cardShadow) => {
    const paddingMap = {
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    };
    const resolvedPadding = typeof padding === 'number' ? padding : paddingMap[padding];

    return StyleSheet.create({
      base: {
        padding: resolvedPadding,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.surface,
      },
      elevated: {
        ...cardShadow,
      },
      muted: {
        backgroundColor: theme.colors.surfaceMuted,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
    });
  });

  return (
    <View
      style={[
        styles.base,
        elevated && styles.elevated,
        variant === 'muted' && styles.muted,
        variant === 'outlined' && styles.outlined,
        style,
      ]}
    >
      {children}
    </View>
  );
}

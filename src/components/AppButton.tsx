/**
 * Purpose: Unified button styles with variants and sizes. / 目的: バリアント/サイズ対応の統一ボタン。
 * Responsibilities: render accessible pressable button with theme styling. / 役割: テーマ適用の押下ボタン表示。
 * Inputs: label, variant, size, disabled, icons. / 入力: ラベル、バリアント、サイズ、無効、アイコン。
 * Outputs: Pressable button UI. / 出力: ボタンUI。
 * Dependencies: theme tokens. / 依存: テーマトークン。
 */
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme, useThemedStyles } from '../ui/theme';

type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'danger' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function AppButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  accessibilityLabel,
  style,
  textStyle,
}: AppButtonProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles((theme) => {
    const sizeTokens = {
      sm: { minHeight: 34, paddingHorizontal: 12, fontSize: 13 },
      md: { minHeight: 44, paddingHorizontal: 16, fontSize: 15 },
      lg: { minHeight: 50, paddingHorizontal: 18, fontSize: 16 },
    };
    const resolvedSize = sizeTokens[size];

    return StyleSheet.create({
      base: {
        minHeight: resolvedSize.minHeight,
        paddingHorizontal: resolvedSize.paddingHorizontal,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.xs,
      },
      text: {
        fontSize: resolvedSize.fontSize,
        fontFamily: theme.font.bodyBold,
      },
      primary: {
        backgroundColor: theme.colors.ink,
        borderWidth: 1,
        borderColor: theme.colors.ink,
      },
      primaryText: {
        color: theme.colors.surface,
      },
      ghost: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      ghostText: {
        color: theme.colors.ink,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      outlineText: {
        color: theme.colors.ink,
      },
      danger: {
        backgroundColor: theme.colors.danger,
        borderWidth: 1,
        borderColor: theme.colors.danger,
      },
      dangerText: {
        color: theme.colors.surface,
      },
      link: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        minHeight: 0,
        paddingHorizontal: 0,
      },
      linkText: {
        color: theme.colors.accentDark,
      },
      pressed: {
        opacity: 0.85,
      },
      disabled: {
        opacity: 0.5,
      },
    });
  });

  const variantStyle =
    variant === 'ghost'
      ? styles.ghost
      : variant === 'outline'
        ? styles.outline
        : variant === 'danger'
          ? styles.danger
          : variant === 'link'
            ? styles.link
            : styles.primary;
  const variantTextStyle =
    variant === 'ghost'
      ? styles.ghostText
      : variant === 'outline'
        ? styles.outlineText
        : variant === 'danger'
          ? styles.dangerText
          : variant === 'link'
            ? styles.linkText
            : styles.primaryText;

  const isDisabled = disabled || loading;
  const spinnerColor =
    variant === 'primary' || variant === 'danger' ? theme.colors.surface : theme.colors.ink;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        style,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={spinnerColor} />
        ) : (
          <>
            {leftIcon}
            <Text style={[styles.text, variantTextStyle, textStyle]}>{label}</Text>
            {rightIcon}
          </>
        )}
      </View>
    </Pressable>
  );
}

/**
 * Purpose: Shared screen wrapper with a subtle gradient background. / 目的: うっすらグラデーション背景の共通スクリーンラッパー。
 * Responsibilities: render gradient backdrop and SafeAreaView. / 役割: グラデーション背景とSafeAreaViewを提供。
 * Inputs: children, safe-area edges, optional container style. / 入力: 子要素、セーフエリア辺、任意スタイル。
 * Outputs: wrapped screen content. / 出力: ラップ済み画面コンテンツ。
 * Dependencies: react-native-svg, theme tokens. / 依存: react-native-svg、テーマトークン。
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTheme, useThemedStyles } from '../ui/theme';

type ScreenProps = {
  children: ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export default function Screen({
  children,
  edges = ['top', 'bottom'],
  style,
  contentStyle,
}: ScreenProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      root: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      safeArea: {
        flex: 1,
      },
    }),
  );

  const gradientStops = theme.colors.backgroundGradient;
  const stopCount = gradientStops.length;

  return (
    <View style={[styles.root, style]}>
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
            {gradientStops.map((color, index) => (
              <Stop
                key={`${color}-${index}`}
                offset={stopCount === 1 ? 0 : index / (stopCount - 1)}
                stopColor={color}
                stopOpacity={1}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGradient)" />
      </Svg>
      <SafeAreaView style={[styles.safeArea, contentStyle]} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}

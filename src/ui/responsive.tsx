/**
 * Purpose: Shared responsive layout helpers for web/tablet layouts. / 目的: Web/タブレット向けの共通レスポンシブヘルパー。
 * Responsibilities: provide max content width and centered container styles. / 役割: 最大幅とセンタリングのスタイル提供。
 * Inputs: current window dimensions. / 入力: 現在の画面幅。
 * Outputs: responsive flags and content container style. / 出力: レスポンシブ情報とコンテナスタイル。
 * Dependencies: react-native dimension hooks. / 依存: RNの画面幅フック。
 * Side effects: none. / 副作用: なし。
 */
import { useWindowDimensions } from 'react-native';

const BREAKPOINT_MD = 768;
const BREAKPOINT_LG = 1024;
const BREAKPOINT_XL = 1280;

const resolveMaxWidth = (width: number) => {
  if (width >= BREAKPOINT_XL) return 1040;
  if (width >= BREAKPOINT_LG) return 920;
  if (width >= BREAKPOINT_MD) return 820;
  return undefined;
};

export const responsiveBreakpoints = {
  md: BREAKPOINT_MD,
  lg: BREAKPOINT_LG,
  xl: BREAKPOINT_XL,
};

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();
  const maxWidth = resolveMaxWidth(width);

  return {
    width,
    maxWidth,
    isWide: width >= BREAKPOINT_LG,
    contentStyle: {
      width: '100%' as const,
      maxWidth,
      alignSelf: 'center' as const,
    },
  };
}

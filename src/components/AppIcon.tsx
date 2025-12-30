/**
 * Purpose: Centralized SVG icon component for the app. / 目的: アプリ共通のSVGアイコンコンポーネント。
 * Responsibilities: map icon names to SVG assets and apply size/color defaults. / 役割: 名前→SVGの対応付けとサイズ/色のデフォルト適用。
 * Inputs: icon name, size, optional color, SVG props. / 入力: アイコン名、サイズ、任意の色、SVG props。
 * Outputs: rendered SVG component. / 出力: 描画されたSVGコンポーネント。
 * Dependencies: theme tokens, bundled SVG assets. / 依存: テーマトークン、同梱SVG資産。
 * Side effects: none. / 副作用: なし。
 * Edge cases: invalid name (TypeScript prevents at compile time). / 例外: 無効な名前（TypeScriptで防止）。
 */
import type { SvgProps } from 'react-native-svg';

import { useTheme } from '../ui/theme';

import ArrowForward from '../assets/icons/icon-arrow-forward.svg';
import ArrowNe from '../assets/icons/icon-arrow-ne.svg';
import Check from '../assets/icons/icon-check.svg';
import Home from '../assets/icons/icon-home.svg';
import Learn from '../assets/icons/icon-learn.svg';
import Memo from '../assets/icons/icon-memo.svg';
import Morning from '../assets/icons/icon-morning.svg';
import Night from '../assets/icons/icon-night.svg';
import Settings from '../assets/icons/icon-settings.svg';
import Uncheck from '../assets/icons/icon-uncheck.svg';

// Canonical icon registry used across screens and tab bar. / 画面・タブで使うアイコンレジストリ。
const ICONS = {
  home: Home,
  learn: Learn,
  morning: Morning,
  night: Night,
  settings: Settings,
  'arrow-forward': ArrowForward,
  'arrow-ne': ArrowNe,
  check: Check,
  uncheck: Uncheck,
  memo: Memo,
} as const;

export type AppIconName = keyof typeof ICONS;

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
} & Omit<SvgProps, 'width' | 'height' | 'color'>;

export function AppIcon({ name, size = 24, color, ...props }: AppIconProps) {
  const { theme } = useTheme();
  const Icon = ICONS[name];
  // Fall back to default ink color when no color is provided. / 色未指定時は標準インク色にフォールバック。
  const resolvedColor = color ?? theme.colors.ink;
  return <Icon width={size} height={size} color={resolvedColor} {...props} />;
}

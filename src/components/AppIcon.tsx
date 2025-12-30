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
  const resolvedColor = color ?? theme.colors.ink;
  return <Icon width={size} height={size} color={resolvedColor} {...props} />;
}

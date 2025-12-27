import { Platform } from 'react-native';

export const theme = {
  colors: {
    background: '#F6F1E8',
    surface: '#FFFFFF',
    surfaceMuted: '#F1E7D9',
    ink: '#1C1A16',
    inkMuted: '#6C6358',
    accent: '#C38B2F',
    accentDark: '#9E6B16',
    accentSoft: '#F2E1C4',
    success: '#2E6B5C',
    successSoft: '#DCEBE6',
    border: '#E6DBC9',
    danger: '#B33A2B',
    dangerSoft: '#F7E0DD',
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
  },
  font: {
    display: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    body: Platform.select({
      ios: 'Avenir Next',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
};

export const cardShadow = {
  shadowColor: '#1C1A16',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 3,
};

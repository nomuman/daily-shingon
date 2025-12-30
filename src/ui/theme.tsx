import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';

import {
  getThemePreference,
  setThemePreference,
  type ThemePreference,
} from '../lib/themePreference';

const font = {
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
};

const radius = { sm: 10, md: 14, lg: 20, xl: 28 };
const spacing = { xs: 6, sm: 10, md: 16, lg: 20, xl: 28 };

export const cardShadowLight = {
  shadowColor: '#0A0F24',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 3,
};

export const cardShadowDark = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.22,
  shadowRadius: 24,
  elevation: 6,
};

export const themeLight = {
  colors: {
    // Light: moonlit paper
    background: '#F7F8FF',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF1FF',

    // Text: deep indigo ink
    ink: '#0A0F24',
    inkMuted: '#4A5475',

    // Accent: starlight blue (matches icon glow)
    accent: '#4E7CFF',
    accentDark: '#2F5FEA',
    accentSoft: '#DDE7FF',

    // Status
    success: '#1CA89C',
    successSoft: '#D9F3F0',

    border: '#DEE3F6',

    danger: '#D84B5A',
    dangerSoft: '#FBE1E5',
  },
  radius,
  spacing,
  font,
};

export const themeDark = {
  colors: {
    // Dark: deep indigo night
    background: '#050816',
    surface: '#0B1230',
    surfaceMuted: '#101A3F',

    // Text: moonlight
    ink: '#F5F7FF',
    inkMuted: '#B6C1E6',

    // Accent: same starlight hue for consistency
    accent: '#7AA7FF',
    accentDark: '#3E6FE6',
    accentSoft: '#162A63',

    // Status
    success: '#34D2C6',
    successSoft: '#0E2F36',

    border: '#1A2A5A',

    danger: '#FF6B7A',
    dangerSoft: '#2A101B',
  },
  radius,
  spacing,
  font,
};

export type Theme = typeof themeLight;
export type CardShadow = typeof cardShadowLight;
export type { ThemePreference } from '../lib/themePreference';

type ThemeContextValue = {
  theme: Theme;
  cardShadow: CardShadow;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  hydrated: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const resolveScheme = (
  systemScheme: ReturnType<typeof useColorScheme>,
  preference: ThemePreference,
): 'light' | 'dark' => {
  if (preference === 'light' || preference === 'dark') return preference;
  return systemScheme === 'dark' ? 'dark' : 'light';
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    getThemePreference()
      .then((saved) => {
        if (!mounted) return;
        setPreferenceState(saved);
        setHydrated(true);
      })
      .catch(() => {
        if (!mounted) return;
        setHydrated(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const colorScheme = resolveScheme(systemScheme, preference);
  const theme = colorScheme === 'dark' ? themeDark : themeLight;
  const cardShadow = colorScheme === 'dark' ? cardShadowDark : cardShadowLight;

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    void setThemePreference(value);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      cardShadow,
      preference,
      setPreference,
      colorScheme,
      isDark: colorScheme === 'dark',
      hydrated,
    }),
    [cardShadow, colorScheme, hydrated, preference, theme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme, cardShadow: CardShadow) => T,
): T {
  const { theme, cardShadow } = useTheme();
  return useMemo(() => factory(theme, cardShadow), [cardShadow, factory, theme]);
}

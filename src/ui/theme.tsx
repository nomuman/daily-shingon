/**
 * Purpose: Central theme system (colors, spacing, typography) with light/dark support. / 目的: ライト/ダーク対応のテーマ中枢。
 * Responsibilities: expose theme tokens, persist preference, and provide themed styles/hooks. / 役割: テーマトークン提供、設定永続化、フック提供。
 * Inputs: system color scheme and stored preference. / 入力: システム配色と保存済み設定。
 * Outputs: ThemeContext values and styled helpers. / 出力: ThemeContext値とスタイルヘルパー。
 * Dependencies: React context, react-native platform APIs, themePreference storage. / 依存: React context、RN API、themePreferenceストレージ。
 * Side effects: loads/saves theme preference from AsyncStorage. / 副作用: AsyncStorageから読込/保存。
 * Edge cases: preference not yet hydrated defaults to "system". / 例外: 未Hydrate時は"system"。
 */
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';

import {
  getThemePreference,
  setThemePreference,
  type ThemePreference,
} from '../lib/themePreference';

// Typeface mapping per platform. / プラットフォーム別のフォント指定。
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

// Global sizing scales. / 全体のサイズスケール。
const radius = { sm: 10, md: 14, lg: 20, xl: 28 };
const spacing = { xs: 6, sm: 10, md: 16, lg: 20, xl: 28 };

// Shadow presets for cards (light mode). / カードの影プリセット（ライト）。
export const cardShadowLight = {
  shadowColor: '#0A0F24',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 3,
};

// Shadow presets for cards (dark mode). / カードの影プリセット（ダーク）。
export const cardShadowDark = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.22,
  shadowRadius: 24,
  elevation: 6,
};

// Light theme tokens. / ライトテーマのトークン。
export const themeLight = {
  colors: {
    // Light: moonlit paper / ライト: 月光の紙のような背景
    background: '#F7F8FF',
    backgroundGradient: ['#F7F8FF', '#E9F0FF', '#F7F8FF'],
    surface: '#FFFFFF',
    surfaceMuted: '#EEF1FF',

    // Text: deep indigo ink / テキスト: 深い藍色インク
    ink: '#0A0F24',
    inkMuted: '#4A5475',

    // Accent: starlight blue (matches icon glow) / アクセント: 星明かりの青（アイコンの光に合わせる）
    accent: '#4E7CFF',
    accentDark: '#2F5FEA',
    accentSoft: '#DDE7FF',

    // Status / ステータス
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

// Dark theme tokens. / ダークテーマのトークン。
export const themeDark = {
  colors: {
    // Dark: deep indigo night / ダーク: 深い藍色の夜
    background: '#050816',
    backgroundGradient: ['#050816', '#0E1B3A', '#050816'],
    surface: '#0B1230',
    surfaceMuted: '#101A3F',

    // Text: moonlight / テキスト: 月光
    ink: '#F5F7FF',
    inkMuted: '#B6C1E6',

    // Accent: same starlight hue for consistency / アクセント: 一貫性のため同系色
    accent: '#7AA7FF',
    accentDark: '#3E6FE6',
    accentSoft: '#162A63',

    // Status / ステータス
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

// Resolve final color scheme based on preference + system. / 設定とシステムから最終配色を決定。
const resolveScheme = (
  systemScheme: ReturnType<typeof useColorScheme>,
  preference: ThemePreference,
): 'light' | 'dark' => {
  if (preference === 'light' || preference === 'dark') return preference;
  return systemScheme === 'dark' ? 'dark' : 'light';
};

// Provider that hydrates preference and exposes theme state. / 設定を読み込みテーマ状態を提供。
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  // Hydrate preference from storage on mount. / マウント時に設定を読み込み。
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

  // Persist preference changes. / 設定変更を保存。
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

// Access theme context; must be under ThemeProvider. / ThemeProvider配下で利用。
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Memoize StyleSheet factories against theme + shadow. / テーマ＋影に対してStyleSheet生成をメモ化。
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme, cardShadow: CardShadow) => T,
): T {
  const { theme, cardShadow } = useTheme();
  return useMemo(() => factory(theme, cardShadow), [cardShadow, factory, theme]);
}

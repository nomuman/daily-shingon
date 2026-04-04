/**
 * Purpose: Stack layout for primary app sections. / 目的: 主要セクション用のスタックレイアウト。
 * Responsibilities: define tab navigation for core sections with platform-aware icons. / 役割: 主要セクションのタブ導線とプラットフォーム別アイコン定義。
 * Inputs: none. / 入力: なし。
 * Outputs: configured Expo Router Tabs. / 出力: 設定済みのTabs。
 * Dependencies: Expo Router, expo-symbols, vector icons, i18n, theme tokens. / 依存: Expo Router、expo-symbols、vector icons、i18n、テーマ。
 * Side effects: none. / 副作用: なし。
 * Edge cases: none (static config). / 例外: なし（静的設定）。
 */
import { Tabs } from 'expo-router';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { useTranslation } from 'react-i18next';
import { useTheme } from '../../ui/theme';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

function TabBarIcon({
  symbolName,
  materialName,
  color,
  size,
}: {
  symbolName: SFSymbol;
  materialName: MaterialIconName;
  color: string;
  size: number;
}) {
  return (
    <SymbolView
      name={symbolName}
      size={size}
      tintColor={color}
      fallback={<MaterialIcons name={materialName} size={size} color={color} />}
    />
  );
}

export default function TabLayout() {
  const { t } = useTranslation('common');
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accentDark,
        tabBarInactiveTintColor: theme.colors.inkMuted,
        tabBarStyle: {
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        tabBarLabelStyle: {
          fontFamily: theme.font.body,
          fontSize: 11,
          letterSpacing: 0.2,
        },
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.today'),
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              symbolName="house.fill"
              materialName="home"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('nav.learn'),
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              symbolName="book.closed.fill"
              materialName="menu-book"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="morning"
        options={{
          title: t('nav.morning'),
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              symbolName="sun.max.fill"
              materialName="wb-sunny"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="night"
        options={{
          title: t('nav.night'),
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              symbolName="moon.stars.fill"
              materialName="nights-stay"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              symbolName="gearshape.fill"
              materialName="settings"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}

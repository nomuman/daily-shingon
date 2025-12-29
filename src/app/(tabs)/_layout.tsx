import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { SFSymbol } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { theme } from '../../ui/theme';

const TabIcon = ({
  symbol,
  fallback,
  color,
  size,
}: {
  symbol: SFSymbol;
  fallback: keyof typeof MaterialIcons.glyphMap;
  color: string;
  size?: number;
}) => (
  <SymbolView
    name={symbol}
    size={size ?? 24}
    tintColor={color}
    weight="semibold"
    scale="medium"
    fallback={<MaterialIcons name={fallback} size={size ?? 24} color={color} />}
  />
);

export default function TabLayout() {
  const { t } = useTranslation('common');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 66,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.colors.accentDark,
        tabBarInactiveTintColor: theme.colors.inkMuted,
        tabBarLabelStyle: {
          fontFamily: theme.font.body,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.today'),
          tabBarIcon: ({ color, size }) => (
            <TabIcon symbol="house.fill" fallback="home" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('nav.learn'),
          tabBarIcon: ({ color, size }) => (
            <TabIcon symbol="book.fill" fallback="menu-book" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="morning"
        options={{
          title: t('nav.morning'),
          tabBarIcon: ({ color, size }) => (
            <TabIcon symbol="sun.max.fill" fallback="wb-sunny" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="night"
        options={{
          title: t('nav.night'),
          tabBarIcon: ({ color, size }) => (
            <TabIcon symbol="moon.stars.fill" fallback="nights-stay" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color, size }) => (
            <TabIcon symbol="gearshape.fill" fallback="settings" color={color} size={size ?? 24} />
          ),
        }}
      />
    </Tabs>
  );
}

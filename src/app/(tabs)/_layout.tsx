import { Tabs } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { AppIcon } from '../../components/AppIcon';
import { useTheme } from '../../ui/theme';

export default function TabLayout() {
  const { t } = useTranslation('common');
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
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
          tabBarIcon: ({ color, size }) => <AppIcon name="home" color={color} size={size ?? 24} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('nav.learn'),
          tabBarIcon: ({ color, size }) => <AppIcon name="learn" color={color} size={size ?? 24} />,
        }}
      />
      <Tabs.Screen
        name="morning"
        options={{
          title: t('nav.morning'),
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="morning" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="night"
        options={{
          title: t('nav.night'),
          tabBarIcon: ({ color, size }) => <AppIcon name="night" color={color} size={size ?? 24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="settings" color={color} size={size ?? 24} />
          ),
        }}
      />
    </Tabs>
  );
}

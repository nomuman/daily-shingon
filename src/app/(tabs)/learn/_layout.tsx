import { Stack } from 'expo-router';

import { theme } from '../../../ui/theme';

export default function LearnLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}

import { StyleSheet, TextInput, View } from 'react-native';

import { theme } from '../ui/theme';

type SearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({ value, onChangeText, placeholder }: SearchInputProps) {
  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? '検索'}
        placeholderTextColor={theme.colors.inkMuted}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: theme.colors.surface,
    color: theme.colors.ink,
    fontFamily: theme.font.body,
  },
});

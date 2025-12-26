import { StyleSheet, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';

type DayFormProps = {
  name: string;
  onChangeName: (value: string) => void;
};

export function DayForm({ name, onChangeName }: DayFormProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;

  return (
    <View style={styles.section}>
      <TextInput
        placeholder="Day name"
        placeholderTextColor={placeholderColor}
        value={name}
        onChangeText={onChangeName}
        style={[styles.input, { borderColor, color: textColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});

import { StyleSheet, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';
import { FormField } from '@/components/ui/form-field';

type DayFormProps = {
  name: string;
  onChangeName: (value: string) => void;
  onBlurName?: () => void;
  error?: string;
};

export function DayForm({ name, onChangeName, onBlurName, error }: DayFormProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const errorBorderColor = colorScheme === 'dark' ? '#f87171' : '#dc2626';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;

  return (
    <View style={styles.section}>
      <FormField label="Day name" error={error}>
        <TextInput
          placeholder="Day name"
          placeholderTextColor={placeholderColor}
          value={name}
          onChangeText={onChangeName}
          onBlur={onBlurName}
          style={[
            styles.input,
            { borderColor: error ? errorBorderColor : borderColor, color: textColor },
          ]}
        />
      </FormField>
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

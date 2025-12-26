import { StyleSheet, TextInput, View } from 'react-native';

import { FormField } from '@/components/ui/form-field';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
type CreatePlanViewProps = {
  nameInput: string;
  gymTypeInput: string;
  onChangeName: (value: string) => void;
  onChangeGymType: (value: string) => void;
  onBlurName?: () => void;
  nameError?: string;
};

export function CreatePlanView({
  nameInput,
  gymTypeInput,
  onChangeName,
  onChangeGymType,
  onBlurName,
  nameError,
}: CreatePlanViewProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const errorBorderColor = colorScheme === 'dark' ? '#f87171' : '#dc2626';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const inputStyle = [styles.input, { borderColor, color: textColor }];

  return (
    <View style={styles.section}>
      <FormField label="Plan name" error={nameError}>
        <TextInput
          placeholder="Plan name"
          placeholderTextColor={placeholderColor}
          value={nameInput}
          onChangeText={onChangeName}
          onBlur={onBlurName}
          style={[
            inputStyle,
            nameError ? { borderColor: errorBorderColor } : null,
          ]}
        />
      </FormField>
      <FormField label="Gym type">
        <TextInput
          placeholder="Gym type (optional)"
          placeholderTextColor={placeholderColor}
          value={gymTypeInput}
          onChangeText={onChangeGymType}
          style={inputStyle}
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

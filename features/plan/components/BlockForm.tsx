import { StyleSheet, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';
import { FormField } from '@/components/ui/form-field';
import { SliderField } from '@/components/ui/slider-field';

type BlockFormProps = {
  title: string;
  durationMinutes: number;
  onChangeTitle: (value: string) => void;
  onChangeDuration: (value: number) => void;
  onBlurTitle?: () => void;
  titleError?: string;
  durationError?: string;
};

export function BlockForm({
  title,
  durationMinutes,
  onChangeTitle,
  onChangeDuration,
  onBlurTitle,
  titleError,
  durationError,
}: BlockFormProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const errorBorderColor = colorScheme === 'dark' ? '#f87171' : '#dc2626';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;

  return (
    <View style={styles.section}>
      <FormField label="Block title" error={titleError}>
        <TextInput
          placeholder="Block title"
          placeholderTextColor={placeholderColor}
          value={title}
          onChangeText={onChangeTitle}
          onBlur={onBlurTitle}
          style={[
            styles.input,
            { borderColor: titleError ? errorBorderColor : borderColor, color: textColor },
          ]}
        />
      </FormField>
      <SliderField
        label="Duration"
        value={durationMinutes}
        min={5}
        max={60}
        step={5}
        onChange={onChangeDuration}
        valueLabel={`${durationMinutes} min`}
        error={durationError}
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

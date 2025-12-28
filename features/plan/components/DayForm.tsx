import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';
import { FormField } from '@/components/ui/form-field';
import type { Weekday } from '@/data/models';
import { Weekdays } from '@/data/models';
import { SecondaryText } from '@/components/ui/text';

type DayFormProps = {
  name: string;
  weekday: Weekday | null;
  onChangeName: (value: string) => void;
  onChangeWeekday: (weekday: Weekday) => void;
  onBlurName?: () => void;
  nameError?: string;
  weekdayError?: string;
};

export function DayForm({
  name,
  weekday,
  onChangeName,
  onChangeWeekday,
  onBlurName,
  nameError,
  weekdayError,
}: DayFormProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const errorBorderColor = colorScheme === 'dark' ? '#f87171' : '#dc2626';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const chipBorder = isDark ? '#374151' : '#d1d5db';
  const chipSelected = isDark ? '#60a5fa' : '#2563eb';
  const chipBackground = isDark ? '#111827' : '#f8fafc';

  return (
    <View style={styles.section}>
      <FormField label="Day name" error={nameError}>
        <TextInput
          placeholder="Day name"
          placeholderTextColor={placeholderColor}
          value={name}
          onChangeText={onChangeName}
          onBlur={onBlurName}
          style={[
            styles.input,
            { borderColor: nameError ? errorBorderColor : borderColor, color: textColor },
          ]}
        />
      </FormField>
      <FormField label="Day of week" error={weekdayError}>
        <View style={styles.weekdayGrid}>
          {Weekdays.map((item) => {
            const isSelected = item === weekday;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                onPress={() => onChangeWeekday(item)}
                style={[
                  styles.weekdayChip,
                  { borderColor: chipBorder, backgroundColor: chipBackground },
                  isSelected ? { borderColor: chipSelected } : null,
                ]}>
                <SecondaryText style={isSelected ? { color: chipSelected } : null}>
                  {item}
                </SecondaryText>
              </Pressable>
            );
          })}
        </View>
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
  weekdayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  weekdayChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
});

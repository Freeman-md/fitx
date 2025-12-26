import { StyleSheet, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';
import { SecondaryText } from '@/components/ui/text';

type BlockFormProps = {
  title: string;
  durationMinutes: string;
  onChangeTitle: (value: string) => void;
  onChangeDuration: (value: string) => void;
};

export function BlockForm({
  title,
  durationMinutes,
  onChangeTitle,
  onChangeDuration,
}: BlockFormProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;

  return (
    <View style={styles.section}>
      <SecondaryText>Block title</SecondaryText>
      <TextInput
        placeholder="Block title"
        placeholderTextColor={placeholderColor}
        value={title}
        onChangeText={onChangeTitle}
        style={[styles.input, { borderColor, color: textColor }]}
      />
      <SecondaryText>Duration minutes</SecondaryText>
      <TextInput
        placeholder="Duration minutes"
        placeholderTextColor={placeholderColor}
        value={durationMinutes}
        onChangeText={onChangeDuration}
        keyboardType="number-pad"
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

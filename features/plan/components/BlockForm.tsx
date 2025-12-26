import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Spacing } from '@/components/ui/spacing';

type BlockFormProps = {
  title: string;
  durationMinutes: string;
  onChangeTitle: (value: string) => void;
  onChangeDuration: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
};

export function BlockForm({
  title,
  durationMinutes,
  onChangeTitle,
  onChangeDuration,
  onSubmit,
  submitLabel,
}: BlockFormProps) {
  return (
    <View style={styles.section}>
      <TextInput
        placeholder="Block title"
        value={title}
        onChangeText={onChangeTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Duration minutes"
        value={durationMinutes}
        onChangeText={onChangeDuration}
        keyboardType="number-pad"
        style={styles.input}
      />
      <Button label={submitLabel} onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});

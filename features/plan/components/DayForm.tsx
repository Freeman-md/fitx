import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Spacing } from '@/components/ui/spacing';

type DayFormProps = {
  name: string;
  onChangeName: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
};

export function DayForm({ name, onChangeName, onSubmit, submitLabel }: DayFormProps) {
  return (
    <View style={styles.section}>
      <TextInput
        placeholder="New day name"
        value={name}
        onChangeText={onChangeName}
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

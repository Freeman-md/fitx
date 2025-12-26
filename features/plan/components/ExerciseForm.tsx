import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Spacing } from '@/components/ui/spacing';

type ExerciseFormProps = {
  name: string;
  sets: string;
  repsMin: string;
  repsMax: string;
  timeSeconds: string;
  restSeconds: string;
  notes: string;
  onChangeName: (value: string) => void;
  onChangeSets: (value: string) => void;
  onChangeRepsMin: (value: string) => void;
  onChangeRepsMax: (value: string) => void;
  onChangeTimeSeconds: (value: string) => void;
  onChangeRestSeconds: (value: string) => void;
  onChangeNotes: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  onCancel?: () => void;
};

export function ExerciseForm({
  name,
  sets,
  repsMin,
  repsMax,
  timeSeconds,
  restSeconds,
  notes,
  onChangeName,
  onChangeSets,
  onChangeRepsMin,
  onChangeRepsMax,
  onChangeTimeSeconds,
  onChangeRestSeconds,
  onChangeNotes,
  onSubmit,
  submitLabel,
  onCancel,
}: ExerciseFormProps) {
  return (
    <View style={styles.section}>
      <TextInput
        placeholder="Exercise name"
        value={name}
        onChangeText={onChangeName}
        style={styles.input}
      />
      <TextInput
        placeholder="Sets"
        value={sets}
        onChangeText={onChangeSets}
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Reps min"
        value={repsMin}
        onChangeText={onChangeRepsMin}
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Reps max"
        value={repsMax}
        onChangeText={onChangeRepsMax}
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Time (seconds)"
        value={timeSeconds}
        onChangeText={onChangeTimeSeconds}
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Rest (seconds)"
        value={restSeconds}
        onChangeText={onChangeRestSeconds}
        keyboardType="number-pad"
        style={styles.input}
      />
      <TextInput placeholder="Notes" value={notes} onChangeText={onChangeNotes} style={styles.input} />
      <View style={styles.row}>
        {onCancel ? <Button label="Cancel" variant="secondary" onPress={onCancel} /> : null}
        <Button label={submitLabel} onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

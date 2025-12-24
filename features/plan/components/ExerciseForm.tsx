import { Button, StyleSheet, TextInput, View } from 'react-native';

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
      <TextInput placeholder="Exercise name" value={name} onChangeText={onChangeName} style={styles.input} />
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
        {onCancel ? <Button title="Cancel" onPress={onCancel} /> : null}
        <Button title={submitLabel} onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

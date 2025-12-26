import { Button, StyleSheet, TextInput, View } from 'react-native';

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
      <Button title={submitLabel} onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
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

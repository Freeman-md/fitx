import { Button, StyleSheet, TextInput, View } from 'react-native';

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

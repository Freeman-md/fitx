import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CreatePlanViewProps = {
  nameInput: string;
  gymTypeInput: string;
  onChangeName: (value: string) => void;
  onChangeGymType: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function CreatePlanView({
  nameInput,
  gymTypeInput,
  onChangeName,
  onChangeGymType,
  onSave,
  onCancel,
}: CreatePlanViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>New Plan</Text>
        <View style={styles.section}>
          <TextInput
            placeholder="Plan name"
            value={nameInput}
            onChangeText={onChangeName}
            style={styles.input}
          />
          <TextInput
            placeholder="Gym type (optional)"
            value={gymTypeInput}
            onChangeText={onChangeGymType}
            style={styles.input}
          />
          <View style={styles.row}>
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Save Plan" onPress={onSave} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
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

import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
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
        <PageTitle>New Plan</PageTitle>
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
            <Button label="Cancel" variant="secondary" onPress={onCancel} />
            <Button label="Save Plan" onPress={onSave} />
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
    padding: Spacing.md,
    gap: Spacing.md,
  },
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

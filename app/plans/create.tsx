import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import type { WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';

export default function CreatePlanScreen() {
  const router = useRouter();
  const [nameInput, setNameInput] = useState('');
  const [gymTypeInput, setGymTypeInput] = useState('');

  const handleSave = async () => {
    const name = nameInput.trim();
    if (!name) {
      Alert.alert('Plan name required', 'Please enter a plan name.');
      return;
    }

    const now = new Date().toISOString();
    const newPlan: WorkoutPlan = {
      id: `plan-${Date.now()}`,
      name,
      gymType: gymTypeInput.trim() || undefined,
      createdAt: now,
      updatedAt: now,
      days: [],
    };

    const existingPlans = await loadWorkoutPlans();
    const nextPlans = [...existingPlans, newPlan];
    await saveWorkoutPlans(nextPlans);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>New Plan</Text>
        <View style={styles.section}>
          <TextInput
            placeholder="Plan name"
            value={nameInput}
            onChangeText={setNameInput}
            style={styles.input}
          />
          <TextInput
            placeholder="Gym type (optional)"
            value={gymTypeInput}
            onChangeText={setGymTypeInput}
            style={styles.input}
          />
          <View style={styles.row}>
            <Button title="Cancel" onPress={() => router.back()} />
            <Button title="Save Plan" onPress={() => void handleSave()} />
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

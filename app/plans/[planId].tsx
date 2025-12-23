import { useCallback, useMemo, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import type { WorkoutDay, WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';

type EditableDay = {
  id: string;
  name: string;
};

export default function PlanDetailScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [newDayName, setNewDayName] = useState('');
  const [editingDay, setEditingDay] = useState<EditableDay | null>(null);

  const loadPlan = useCallback(async () => {
    const storedPlans = await loadWorkoutPlans();
    setPlans(storedPlans);
    const selectedPlan = storedPlans.find((item) => item.id === planId) ?? null;
    setPlan(selectedPlan);
  }, [planId]);

  useFocusEffect(
    useCallback(() => {
      void loadPlan();
    }, [loadPlan])
  );

  const orderedDays = useMemo(() => {
    if (!plan) {
      return [];
    }
    return [...plan.days].sort((a, b) => a.order - b.order);
  }, [plan]);

  const persistPlan = async (nextPlan: WorkoutPlan) => {
    const nextPlans = plans.map((item) => (item.id === nextPlan.id ? nextPlan : item));
    await saveWorkoutPlans(nextPlans);
    setPlans(nextPlans);
    setPlan(nextPlan);
  };

  const handleAddDay = async () => {
    if (!plan) {
      return;
    }
    const name = newDayName.trim();
    if (!name) {
      Alert.alert('Day name required', 'Please enter a day name.');
      return;
    }
    const nextOrder = orderedDays.length > 0 ? orderedDays[orderedDays.length - 1].order + 1 : 1;
    const nextDay: WorkoutDay = {
      id: `day-${Date.now()}`,
      name,
      order: nextOrder,
      blocks: [],
    };
    const nextPlan = {
      ...plan,
      days: [...plan.days, nextDay],
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(nextPlan);
    setNewDayName('');
  };

  const handleRenameDay = async () => {
    if (!plan || !editingDay) {
      return;
    }
    const name = editingDay.name.trim();
    if (!name) {
      Alert.alert('Day name required', 'Please enter a day name.');
      return;
    }
    const nextPlan = {
      ...plan,
      days: plan.days.map((day) =>
        day.id === editingDay.id ? { ...day, name } : day
      ),
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(nextPlan);
    setEditingDay(null);
  };

  const handleDeleteDay = (day: WorkoutDay) => {
    if (!plan) {
      return;
    }
    Alert.alert('Delete Day', `Delete "${day.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const remainingDays = plan.days.filter((item) => item.id !== day.id);
          const nextPlan = {
            ...plan,
            days: remainingDays,
            updatedAt: new Date().toISOString(),
          };
          await persistPlan(nextPlan);
        },
      },
    ]);
  };

  const normalizeDayOrder = (days: WorkoutDay[]) => {
    return days.map((day, index) => ({ ...day, order: index + 1 }));
  };

  const moveDay = async (dayId: string, direction: 'up' | 'down') => {
    if (!plan) {
      return;
    }
    const days = [...orderedDays];
    const index = days.findIndex((day) => day.id === dayId);
    if (index === -1) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= days.length) {
      return;
    }
    const nextDays = [...days];
    [nextDays[index], nextDays[targetIndex]] = [nextDays[targetIndex], nextDays[index]];
    const normalizedDays = normalizeDayOrder(nextDays);
    const nextPlan = {
      ...plan,
      days: normalizedDays,
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(nextPlan);
  };

  if (!plan) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <Text>Plan not found.</Text>
          <Button title="Back to Plans" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>{plan.name}</Text>
        {plan.gymType ? <Text style={styles.subtitle}>{plan.gymType}</Text> : null}
        <View style={styles.section}>
          <TextInput
            placeholder="New day name"
            value={newDayName}
            onChangeText={setNewDayName}
            style={styles.input}
          />
          <Button title="Add Day" onPress={() => void handleAddDay()} />
        </View>
        <View style={styles.section}>
          {orderedDays.length === 0 ? (
            <Text>No days yet.</Text>
          ) : (
            orderedDays.map((day) => (
              <View key={day.id} style={styles.dayCard}>
                {editingDay?.id === day.id ? (
                  <>
                    <TextInput
                      value={editingDay.name}
                      onChangeText={(value) =>
                        setEditingDay({ id: day.id, name: value })
                      }
                      style={styles.input}
                    />
                    <View style={styles.row}>
                      <Button title="Cancel" onPress={() => setEditingDay(null)} />
                      <Button title="Save" onPress={() => void handleRenameDay()} />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.row}>
                      <Text style={styles.dayName}>{day.name}</Text>
                      <Text style={styles.dayOrder}>#{day.order}</Text>
                    </View>
                    <View style={styles.row}>
                      <Button title="Up" onPress={() => void moveDay(day.id, 'up')} />
                      <Button title="Down" onPress={() => void moveDay(day.id, 'down')} />
                      <Button
                        title="Rename"
                        onPress={() => setEditingDay({ id: day.id, name: day.name })}
                      />
                      <Button title="Delete" onPress={() => handleDeleteDay(day)} />
                    </View>
                  </>
                )}
              </View>
            ))
          )}
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
  subtitle: {
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.7,
  },
  section: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dayCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayOrder: {
    fontSize: 12,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

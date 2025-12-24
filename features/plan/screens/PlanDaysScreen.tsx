import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { usePlanDays, type DayEdit } from '@/features/plan/hooks/use-plan-days';

export default function PlanDaysScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { plan, orderedDays, addDay, renameDay, deleteDay, moveDay } = usePlanDays(planId);
  const [newDayName, setNewDayName] = useState('');
  const [editingDay, setEditingDay] = useState<DayEdit | null>(null);

  const handleAddDay = async () => {
    const name = newDayName.trim();
    if (!name) {
      Alert.alert('Day name required', 'Please enter a day name.');
      return;
    }
    const added = await addDay(name);
    if (added) {
      setNewDayName('');
    }
  };

  const handleRenameDay = async () => {
    if (!editingDay) {
      return;
    }
    const name = editingDay.name.trim();
    if (!name) {
      Alert.alert('Day name required', 'Please enter a day name.');
      return;
    }
    await renameDay({ id: editingDay.id, name });
    setEditingDay(null);
  };

  const handleDeleteDay = (dayId: string, dayName: string) => {
    Alert.alert('Delete Day', `Delete "${dayName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDay(dayId);
        },
      },
    ]);
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
              <View key={day.id} style={styles.card}>
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
                      <Text style={styles.cardTitle}>{day.name}</Text>
                      <Text style={styles.cardMeta}>#{day.order}</Text>
                    </View>
                    <View style={styles.row}>
                      <Button title="Up" onPress={() => void moveDay(day.id, 'up')} />
                      <Button title="Down" onPress={() => void moveDay(day.id, 'down')} />
                      <Button
                        title="Blocks"
                        onPress={() => router.push(`/plans/${plan.id}/days/${day.id}`)}
                      />
                      <Button
                        title="Rename"
                        onPress={() => setEditingDay({ id: day.id, name: day.name })}
                      />
                      <Button
                        title="Delete"
                        onPress={() => handleDeleteDay(day.id, day.name)}
                      />
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
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardMeta: {
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

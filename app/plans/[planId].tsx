import { useCallback, useMemo, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import type { Block, WorkoutDay, WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';

type EditableDay = {
  id: string;
  name: string;
};

type EditableBlock = {
  dayId: string;
  id: string;
  title: string;
  durationMinutes: string;
};

type BlockDraft = {
  title: string;
  durationMinutes: string;
};

export default function PlanDetailScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [newDayName, setNewDayName] = useState('');
  const [editingDay, setEditingDay] = useState<EditableDay | null>(null);
  const [editingBlock, setEditingBlock] = useState<EditableBlock | null>(null);
  const [blockDrafts, setBlockDrafts] = useState<Record<string, BlockDraft>>({});

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

  const getBlockDraft = (dayId: string): BlockDraft => {
    return blockDrafts[dayId] ?? { title: '', durationMinutes: '' };
  };

  const updateBlockDraft = (dayId: string, nextDraft: BlockDraft) => {
    setBlockDrafts((current) => ({ ...current, [dayId]: nextDraft }));
  };

  const persistPlan = async (nextPlan: WorkoutPlan) => {
    const nextPlans = plans.map((item) => (item.id === nextPlan.id ? nextPlan : item));
    await saveWorkoutPlans(nextPlans);
    setPlans(nextPlans);
    setPlan(nextPlan);
  };

  const updateDay = async (dayId: string, updater: (day: WorkoutDay) => WorkoutDay) => {
    if (!plan) {
      return;
    }
    const nextPlan = {
      ...plan,
      days: plan.days.map((day) => (day.id === dayId ? updater(day) : day)),
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(nextPlan);
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

  const normalizeBlockOrder = (blocks: Block[]) => {
    return blocks.map((block, index) => ({ ...block, order: index + 1 }));
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

  const handleAddBlock = async (day: WorkoutDay) => {
    const draft = getBlockDraft(day.id);
    const title = draft.title.trim();
    if (!title) {
      Alert.alert('Block title required', 'Please enter a block title.');
      return;
    }
    const duration = Number(draft.durationMinutes);
    if (!Number.isFinite(duration) || duration <= 0) {
      Alert.alert('Duration required', 'Please enter a valid duration in minutes.');
      return;
    }
    const orderedBlocks = [...day.blocks].sort((a, b) => a.order - b.order);
    const nextOrder =
      orderedBlocks.length > 0 ? orderedBlocks[orderedBlocks.length - 1].order + 1 : 1;
    const nextBlock: Block = {
      id: `block-${Date.now()}`,
      title,
      durationMinutes: duration,
      order: nextOrder,
      exercises: [],
    };
    await updateDay(day.id, (currentDay) => ({
      ...currentDay,
      blocks: [...currentDay.blocks, nextBlock],
    }));
    updateBlockDraft(day.id, { title: '', durationMinutes: '' });
  };

  const handleStartEditBlock = (dayId: string, block: Block) => {
    setEditingBlock({
      dayId,
      id: block.id,
      title: block.title,
      durationMinutes: String(block.durationMinutes),
    });
  };

  const handleSaveBlockEdit = async () => {
    if (!editingBlock) {
      return;
    }
    const title = editingBlock.title.trim();
    if (!title) {
      Alert.alert('Block title required', 'Please enter a block title.');
      return;
    }
    const duration = Number(editingBlock.durationMinutes);
    if (!Number.isFinite(duration) || duration <= 0) {
      Alert.alert('Duration required', 'Please enter a valid duration in minutes.');
      return;
    }
    await updateDay(editingBlock.dayId, (day) => ({
      ...day,
      blocks: day.blocks.map((block) =>
        block.id === editingBlock.id
          ? { ...block, title, durationMinutes: duration }
          : block
      ),
    }));
    setEditingBlock(null);
  };

  const handleDeleteBlock = (dayId: string, block: Block) => {
    Alert.alert('Delete Block', `Delete "${block.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await updateDay(dayId, (day) => ({
            ...day,
            blocks: day.blocks.filter((item) => item.id !== block.id),
          }));
        },
      },
    ]);
  };

  const moveBlock = async (day: WorkoutDay, blockId: string, direction: 'up' | 'down') => {
    const blocks = [...day.blocks].sort((a, b) => a.order - b.order);
    const index = blocks.findIndex((block) => block.id === blockId);
    if (index === -1) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) {
      return;
    }
    const nextBlocks = [...blocks];
    [nextBlocks[index], nextBlocks[targetIndex]] = [nextBlocks[targetIndex], nextBlocks[index]];
    const normalizedBlocks = normalizeBlockOrder(nextBlocks);
    await updateDay(day.id, (currentDay) => ({
      ...currentDay,
      blocks: normalizedBlocks,
    }));
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
                <View style={styles.section}>
                  <Text style={styles.blockTitle}>Blocks</Text>
                  <TextInput
                    placeholder="Block title"
                    value={getBlockDraft(day.id).title}
                    onChangeText={(value) =>
                      updateBlockDraft(day.id, {
                        ...getBlockDraft(day.id),
                        title: value,
                      })
                    }
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Duration minutes"
                    value={getBlockDraft(day.id).durationMinutes}
                    onChangeText={(value) =>
                      updateBlockDraft(day.id, {
                        ...getBlockDraft(day.id),
                        durationMinutes: value,
                      })
                    }
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  <Button title="Add Block" onPress={() => void handleAddBlock(day)} />
                  {day.blocks.length === 0 ? (
                    <Text>No blocks yet.</Text>
                  ) : (
                    [...day.blocks]
                      .sort((a, b) => a.order - b.order)
                      .map((block) => (
                        <View key={block.id} style={styles.blockCard}>
                          {editingBlock?.id === block.id &&
                          editingBlock.dayId === day.id ? (
                            <>
                              <TextInput
                                value={editingBlock.title}
                                onChangeText={(value) =>
                                  setEditingBlock({
                                    ...editingBlock,
                                    title: value,
                                  })
                                }
                                style={styles.input}
                              />
                              <TextInput
                                value={editingBlock.durationMinutes}
                                onChangeText={(value) =>
                                  setEditingBlock({
                                    ...editingBlock,
                                    durationMinutes: value,
                                  })
                                }
                                keyboardType="number-pad"
                                style={styles.input}
                              />
                              <View style={styles.row}>
                                <Button title="Cancel" onPress={() => setEditingBlock(null)} />
                                <Button title="Save" onPress={() => void handleSaveBlockEdit()} />
                              </View>
                            </>
                          ) : (
                            <>
                              <View style={styles.row}>
                                <Text style={styles.blockName}>{block.title}</Text>
                                <Text style={styles.blockMeta}>
                                  {block.durationMinutes}m · #{block.order}
                                </Text>
                              </View>
                              <View style={styles.row}>
                                <Button
                                  title="Up"
                                  onPress={() => void moveBlock(day, block.id, 'up')}
                                />
                                <Button
                                  title="Down"
                                  onPress={() => void moveBlock(day, block.id, 'down')}
                                />
                                <Button
                                  title="Edit"
                                  onPress={() => handleStartEditBlock(day.id, block)}
                                />
                                <Button
                                  title="Delete"
                                  onPress={() => handleDeleteBlock(day.id, block)}
                                />
                              </View>
                            </>
                          )}
                        </View>
                      ))
                  )}
                </View>
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
  blockTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  blockCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  blockName: {
    fontSize: 15,
    fontWeight: '600',
  },
  blockMeta: {
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

import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BlockCard } from '@/features/plan/components/BlockCard';
import { BlockForm } from '@/features/plan/components/BlockForm';
import { useDayBlocks } from '@/features/plan/hooks/use-day-blocks';

type EditableBlock = {
  id: string;
  title: string;
  durationMinutes: string;
};

export default function DayBlocksScreen() {
  const router = useRouter();
  const { planId, dayId } = useLocalSearchParams<{ planId: string; dayId: string }>();
  const { currentPlan, currentDay, orderedBlocks, addBlock, editBlock, deleteBlock, moveBlock } =
    useDayBlocks(planId, dayId);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDuration, setDraftDuration] = useState('');
  const [editingBlock, setEditingBlock] = useState<EditableBlock | null>(null);

  const handleAddBlock = async () => {
    const title = draftTitle.trim();
    if (!title) {
      Alert.alert('Block title required', 'Please enter a block title.');
      return;
    }
    const duration = Number(draftDuration);
    if (!Number.isFinite(duration) || duration <= 0) {
      Alert.alert('Duration required', 'Please enter a valid duration in minutes.');
      return;
    }
    const added = await addBlock(title, duration);
    if (added) {
      setDraftTitle('');
      setDraftDuration('');
    }
  };

  const handleSaveEdit = async () => {
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
    await editBlock(editingBlock.id, title, duration);
    setEditingBlock(null);
  };

  const handleDelete = (blockId: string, blockTitle: string) => {
    Alert.alert('Delete Block', `Delete "${blockTitle}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteBlock(blockId);
        },
      },
    ]);
  };

  if (!currentPlan || !currentDay) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <Text>Day not found.</Text>
          <Button title="Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>{currentDay.name}</Text>
        <Text style={styles.subtitle}>
          {currentPlan.name} · {currentPlan.gymType ?? 'No gym type'}
        </Text>
        <View style={styles.section}>
          <BlockForm
            title={draftTitle}
            durationMinutes={draftDuration}
            onChangeTitle={setDraftTitle}
            onChangeDuration={setDraftDuration}
            onSubmit={() => void handleAddBlock()}
            submitLabel="Add Block"
          />
        </View>
        <View style={styles.section}>
          {orderedBlocks.length === 0 ? (
            <Text>No blocks yet.</Text>
          ) : (
            orderedBlocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                isEditing={editingBlock?.id === block.id}
                editingTitle={editingBlock?.title ?? block.title}
                editingDuration={editingBlock?.durationMinutes ?? String(block.durationMinutes)}
                onChangeTitle={(value) =>
                  setEditingBlock((current) =>
                    current ? { ...current, title: value } : current
                  )
                }
                onChangeDuration={(value) =>
                  setEditingBlock((current) =>
                    current ? { ...current, durationMinutes: value } : current
                  )
                }
                onCancelEdit={() => setEditingBlock(null)}
                onSaveEdit={() => void handleSaveEdit()}
                onMoveUp={() => void moveBlock(block.id, 'up')}
                onMoveDown={() => void moveBlock(block.id, 'down')}
                onShowExercises={() =>
                  router.push(`/plans/${currentPlan.id}/days/${currentDay.id}/blocks/${block.id}`)
                }
                onStartEdit={() =>
                  setEditingBlock({
                    id: block.id,
                    title: block.title,
                    durationMinutes: String(block.durationMinutes),
                  })
                }
                onDelete={() => handleDelete(block.id, block.title)}
              />
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
    fontSize: 12,
    opacity: 0.7,
  },
  section: {
    gap: 12,
  },
});

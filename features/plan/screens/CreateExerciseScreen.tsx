import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ExerciseForm } from '@/features/plan/components/ExerciseForm';
import { useBlockExercises } from '@/features/plan/hooks/use-block-exercises';
import {
  buildExerciseFromDraft,
  emptyDraft,
  hasPerformanceTarget,
  type ExerciseDraft,
} from '@/features/plan/utils/exercise-helpers';
import { getNextOrder } from '@/features/plan/utils/order';

export default function CreateExerciseScreen() {
  const router = useRouter();
  const { planId, dayId, blockId } = useLocalSearchParams<{
    planId: string;
    dayId: string;
    blockId: string;
  }>();
  const { currentPlan, currentDay, currentBlock, orderedExercises, addExercise } = useBlockExercises(
    planId,
    dayId,
    blockId
  );
  const [draft, setDraft] = useState<ExerciseDraft>(emptyDraft);
  const [mode, setMode] = useState<'reps' | 'time'>('reps');
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const surfaceColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  const setDraftField = (field: keyof ExerciseDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleModeChange = (nextMode: 'reps' | 'time') => {
    setMode(nextMode);
    if (nextMode === 'time') {
      setDraft((current) => ({ ...current, repsMin: '', repsMax: '' }));
    } else {
      setDraft((current) => ({ ...current, timeSeconds: '' }));
    }
  };

  const handleSave = async () => {
    if (!currentBlock) {
      return;
    }
    const normalizedDraft =
      mode === 'time'
        ? { ...draft, repsMin: '', repsMax: '' }
        : { ...draft, timeSeconds: '' };
    if (!hasPerformanceTarget(normalizedDraft)) {
      Alert.alert('Exercise needs reps or time', 'Add reps or time to save this exercise.');
      return;
    }
    const order = getNextOrder(orderedExercises);
    const nextExercise = buildExerciseFromDraft(normalizedDraft, order);
    await addExercise(nextExercise);
    router.back();
  };

  if (!currentPlan || !currentDay || !currentBlock) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Add Exercise',
            headerBackTitle: 'Back',
            headerBackTitleVisible: true,
          }}
        />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.container}>
            <EmptyState title="Block not found" description="This block may have been deleted." />
            <Button label="Back" variant="secondary" onPress={() => router.back()} />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Add Exercise',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
          <ExerciseForm
            name={draft.name}
            sets={draft.sets}
            repsMin={draft.repsMin}
            repsMax={draft.repsMax}
            timeSeconds={draft.timeSeconds}
            restSeconds={draft.restSeconds}
            notes={draft.notes}
            mode={mode}
            onChangeMode={handleModeChange}
            onChangeName={(value) => setDraftField('name', value)}
            onChangeSets={(value) => setDraftField('sets', value)}
            onChangeRepsMin={(value) => setDraftField('repsMin', value)}
            onChangeRepsMax={(value) => setDraftField('repsMax', value)}
            onChangeTimeSeconds={(value) => setDraftField('timeSeconds', value)}
            onChangeRestSeconds={(value) => setDraftField('restSeconds', value)}
            onChangeNotes={(value) => setDraftField('notes', value)}
          />
        </ScrollView>
        <View style={[styles.footer, { borderTopColor: borderColor, backgroundColor: surfaceColor }]}>
          <Button label="Cancel" variant="secondary" onPress={() => router.back()} style={styles.fullWidth} />
          <Button label="Save" onPress={() => void handleSave()} style={styles.fullWidth} />
        </View>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
});

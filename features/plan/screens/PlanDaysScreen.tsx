import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/components/ui/spacing';
import { DayForm } from '@/features/plan/components/DayForm';
import { PlanDaysView } from '@/features/plan/components/PlanDaysView';
import { usePlanDaysScreen } from '@/features/plan/hooks/use-plan-days-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PlanDaysScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const {
    plan,
    orderedDays,
    newDayName,
    setNewDayName,
    editingDay,
    beginDayEdit,
    setEditingName,
    saveDayName,
    confirmDeleteDay,
    moveDay,
    addDayWithValidation,
    cancelDayEdit,
  } = usePlanDaysScreen(planId);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const colorScheme = useColorScheme();
  const destructiveColor = colorScheme === 'dark' ? '#f87171' : '#dc2626';

  const closeAddDaySheet = () => {
    setIsAddOpen(false);
    setNewDayName('');
  };

  const handleAddDay = async () => {
    const added = await addDayWithValidation();
    if (added) {
      closeAddDaySheet();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Plan Details',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <PlanDaysView
        planName={plan?.name}
        gymType={plan?.gymType}
        days={orderedDays}
        onAddDay={() => setIsAddOpen(true)}
        onMoveDayUp={(dayId) => void moveDay(dayId, 'up')}
        onMoveDayDown={(dayId) => void moveDay(dayId, 'down')}
        onOpenBlocks={(dayId) => router.push(`/plans/${planId}/days/${dayId}`)}
        onEditDay={beginDayEdit}
        onBack={() => router.back()}
        isMissing={!plan}
      />
      <BottomSheet
        visible={isAddOpen}
        title="Add Day"
        onDismiss={closeAddDaySheet}
        footer={
          <View style={styles.footer}>
            <Button label="Save" onPress={() => void handleAddDay()} style={styles.fullWidth} />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={closeAddDaySheet}
              style={styles.fullWidth}
            />
          </View>
        }>
        <DayForm name={newDayName} onChangeName={setNewDayName} />
      </BottomSheet>
      <BottomSheet
        visible={Boolean(editingDay)}
        title="Edit Day"
        onDismiss={cancelDayEdit}
        footer={
          <View style={styles.footer}>
            <Button label="Save" onPress={() => void saveDayName()} style={styles.fullWidth} />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={cancelDayEdit}
              style={styles.fullWidth}
            />
          </View>
        }>
        {editingDay ? (
          <View style={styles.editSection}>
            <DayForm name={editingDay.name} onChangeName={setEditingName} />
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                confirmDeleteDay(editingDay.id, editingDay.name);
                cancelDayEdit();
              }}
              style={styles.deleteButton}>
              <Text style={[styles.deleteText, { color: destructiveColor }]}>Delete day</Text>
            </Pressable>
          </View>
        ) : null}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  editSection: {
    gap: Spacing.md,
  },
  deleteButton: {
    paddingVertical: Spacing.xs,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

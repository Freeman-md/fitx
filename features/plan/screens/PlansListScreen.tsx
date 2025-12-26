import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Spacing } from '@/components/ui/spacing';
import { PlansListView } from '@/features/plan/components/PlansListView';
import { CreatePlanView } from '@/features/plan/components/CreatePlanView';
import { useCreatePlan } from '@/features/plan/hooks/use-create-plan';
import { usePlansList } from '@/features/plan/hooks/use-plans-list';

export default function PlansListScreen() {
  const router = useRouter();
  const { plans, requestDeletePlan, refreshPlans } = usePlansList();
  const { nameInput, setNameInput, gymTypeInput, setGymTypeInput, savePlan } = useCreatePlan();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const closeCreateSheet = () => {
    setIsCreateOpen(false);
    setNameInput('');
    setGymTypeInput('');
  };

  const handleCreatePlan = async () => {
    const saved = await savePlan();
    if (saved) {
      await refreshPlans();
      closeCreateSheet();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Plans',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <PlansListView
        plans={plans}
        onCreatePlan={() => setIsCreateOpen(true)}
        onSelectPlan={(planId) => router.push(`/plans/${planId}`)}
        onDeletePlan={requestDeletePlan}
      />
      <BottomSheet
        visible={isCreateOpen}
        title="Add Plan"
        onDismiss={closeCreateSheet}
        footer={
          <View style={styles.footer}>
            <Button label="Save" onPress={() => void handleCreatePlan()} style={styles.fullWidth} />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={closeCreateSheet}
              style={styles.fullWidth}
            />
          </View>
        }>
        <CreatePlanView
          nameInput={nameInput}
          gymTypeInput={gymTypeInput}
          onChangeName={setNameInput}
          onChangeGymType={setGymTypeInput}
        />
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
});

import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FormFooter } from '@/components/ui/form-footer';
import { PlansListView } from '@/features/plan/components/PlansListView';
import { CreatePlanView } from '@/features/plan/components/CreatePlanView';
import { useCreatePlan } from '@/features/plan/hooks/use-create-plan';
import { usePlansList } from '@/features/plan/hooks/use-plans-list';

export default function PlansListScreen() {
  const router = useRouter();
  const { plans, requestDeletePlan, refreshPlans } = usePlansList();
  const { nameInput, setNameInput, gymTypeInput, setGymTypeInput, savePlan } = useCreatePlan();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [planNameTouched, setPlanNameTouched] = useState(false);

  const trimmedName = nameInput.trim();
  const nameError =
    planNameTouched && trimmedName.length === 0
      ? 'Plan name is required.'
      : planNameTouched && trimmedName.length < 2
        ? 'Plan name must be at least 2 characters.'
        : '';
  const isPlanValid = trimmedName.length >= 2;

  const closeCreateSheet = () => {
    setIsCreateOpen(false);
    setNameInput('');
    setGymTypeInput('');
    setPlanNameTouched(false);
  };

  const handleCreatePlan = async () => {
    if (!isPlanValid) {
      return;
    }
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
          <FormFooter
            primaryLabel="Save"
            secondaryLabel="Cancel"
            onPrimary={() => void handleCreatePlan()}
            onSecondary={closeCreateSheet}
            primaryDisabled={!isPlanValid}
          />
        }>
        <CreatePlanView
          nameInput={nameInput}
          gymTypeInput={gymTypeInput}
          onChangeName={(value) => {
            setNameInput(value);
            if (!planNameTouched) {
              setPlanNameTouched(true);
            }
          }}
          onChangeGymType={setGymTypeInput}
          onBlurName={() => setPlanNameTouched(true)}
          nameError={nameError}
        />
      </BottomSheet>
    </>
  );
}

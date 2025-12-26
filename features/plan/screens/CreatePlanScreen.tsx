import { useRouter } from 'expo-router';

import { CreatePlanView } from '@/features/plan/components/CreatePlanView';
import { useCreatePlan } from '@/features/plan/hooks/use-create-plan';

export default function CreatePlanScreen() {
  const router = useRouter();
  const { nameInput, gymTypeInput, setNameInput, setGymTypeInput, savePlan } = useCreatePlan();

  const handleSave = async () => {
    const saved = await savePlan();
    if (saved) {
      router.back();
    }
  };

  return (
    <CreatePlanView
      nameInput={nameInput}
      gymTypeInput={gymTypeInput}
      onChangeName={setNameInput}
      onChangeGymType={setGymTypeInput}
      onSave={() => void handleSave()}
      onCancel={() => router.back()}
    />
  );
}

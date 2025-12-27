import { Stack, useRouter } from 'expo-router';

import { saveHasCompletedOnboarding } from '@/data/storage';
import { OnboardingView } from '@/features/onboarding/components/OnboardingView';

const slides = [
  {
    id: 'slide-1',
    title: 'Plan',
    description: 'Simple templates, ready to run.',
    image: require('../../../assets/images/splash-icon.png'),
  },
  {
    id: 'slide-2',
    title: 'Train',
    description: 'Stay focused on the next set.',
    image: require('../../../assets/images/splash-icon.png'),
  },
  {
    id: 'slide-3',
    title: 'Review',
    description: 'Clear records of what happened.',
    image: require('../../../assets/images/splash-icon.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();

  const handleComplete = async () => {
    await saveHasCompletedOnboarding(true);
    router.replace('/(tabs)/train');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingView slides={slides} onComplete={handleComplete} />
    </>
  );
}

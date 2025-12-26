import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTrainColors } from '@/features/session/utils/train-theme';

export function useTrainTheme() {
  const colorScheme = useColorScheme();
  return {
    colors: getTrainColors(colorScheme),
    colorScheme,
    isDark: colorScheme === 'dark',
  };
}

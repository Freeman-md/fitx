import { StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { FullScreenFocus } from '@/components/ui/focus-layout';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type RestViewProps = {
  secondsRemaining: number;
  onSkipRest: () => void;
};

export function RestView({ secondsRemaining, onSkipRest }: RestViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor =
    colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  return (
    <FullScreenFocus style={[styles.container, { backgroundColor }]}>
      <PrimaryText style={styles.countdown}>{secondsRemaining}</PrimaryText>
      <SecondaryText style={styles.label}>Rest</SecondaryText>
      <Button label="Skip Rest" onPress={onSkipRest} variant="secondary" size="compact" />
    </FullScreenFocus>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  countdown: {
    fontSize: 64,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
  },
});

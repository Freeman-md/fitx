import { Pressable, StyleSheet, Text } from 'react-native';

import type { TrainColors } from '@/features/session/utils/train-theme';

type ActionButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
  variant: 'primary' | 'secondary' | 'destructive';
  colors: TrainColors;
};

export function ActionButton({ label, onPress, variant, colors }: ActionButtonProps) {
  const variantStyle =
    variant === 'primary'
      ? { backgroundColor: colors.buttonPrimaryBg }
      : variant === 'secondary'
        ? {
            backgroundColor: colors.buttonSecondaryBg,
            borderWidth: 1,
            borderColor: colors.buttonSecondaryBorder,
          }
        : { backgroundColor: colors.buttonDestructiveBg };
  const variantTextStyle =
    variant === 'primary'
      ? { color: colors.buttonPrimaryText }
      : variant === 'secondary'
        ? { color: colors.buttonSecondaryText }
        : { color: colors.buttonDestructiveText };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.buttonBase, variantStyle, pressed && styles.buttonPressed]}>
      <Text style={[styles.buttonText, variantTextStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Spacing } from '@/components/ui/spacing';

type FormFooterProps = {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryDisabled?: boolean;
};

export function FormFooter({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryDisabled = false,
}: FormFooterProps) {
  return (
    <View style={styles.footer}>
      <Button label={primaryLabel} onPress={onPrimary} disabled={primaryDisabled} style={styles.fullWidth} />
      <Button
        label={secondaryLabel}
        variant="secondary"
        onPress={onSecondary}
        style={styles.fullWidth}
      />
    </View>
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

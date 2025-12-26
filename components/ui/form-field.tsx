import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { useColorScheme } from '@/hooks/use-color-scheme';

type FormFieldProps = {
  label: string;
  error?: string;
  helper?: string;
  children: ReactNode;
};

export function FormField({ label, error, helper, children }: FormFieldProps) {
  const colorScheme = useColorScheme();
  const errorColor = colorScheme === 'dark' ? '#f87171' : '#dc2626';

  return (
    <View style={styles.field}>
      <SecondaryText style={styles.label}>{label}</SecondaryText>
      {children}
      {helper ? <SecondaryText style={styles.helper}>{helper}</SecondaryText> : null}
      {error ? <Text style={[styles.error, { color: errorColor }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  helper: {
    fontSize: 12,
    opacity: 0.7,
  },
  error: {
    fontSize: 12,
    fontWeight: '600',
  },
});

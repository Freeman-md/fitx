import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/components/ui/spacing';

type FullScreenFocusProps = ViewProps & {
  children: ReactNode;
};

export function FullScreenFocus({ children, style, ...props }: FullScreenFocusProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={[styles.container, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
});

import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { Spacing } from '@/components/ui/spacing';

export function SplashView() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitX</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.dark.text,
    letterSpacing: 1,
  },
});

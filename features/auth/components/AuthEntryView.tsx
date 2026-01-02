import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { PageTitle, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type AuthEntryViewProps = {
  onContinue: () => void;
  onSignIn: () => void;
};

export function AuthEntryView({ onContinue, onSignIn }: AuthEntryViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <PageTitle>Account</PageTitle>
          <SecondaryText style={styles.subtitle}>
            Sign in to attach your workouts to an account. You can also skip for now.
          </SecondaryText>
        </View>
        <View style={styles.actions}>
          <Button label="Sign in with email" onPress={onSignIn} />
          <Button label="Continue without account" variant="secondary" onPress={onContinue} />
        </View>
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
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  actions: {
    marginTop: 'auto',
    gap: Spacing.sm,
  },
});

import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DayForm } from '@/features/plan/components/DayForm';
import { usePlanDays } from '@/features/plan/hooks/use-plan-days';
import { getRequiredNameAlert } from '@/features/plan/utils/validation';

export default function CreateDayScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { plan, addDay } = usePlanDays(planId);
  const [name, setName] = useState('');
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const surfaceColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  const handleSave = async () => {
    const error = getRequiredNameAlert('Day name', name);
    if (error) {
      Alert.alert(error.title, error.message);
      return;
    }
    const added = await addDay(name.trim());
    if (added) {
      router.back();
    }
  };

  if (!plan) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Add Day',
            headerBackTitle: 'Back',
            headerBackTitleVisible: true,
          }}
        />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.container}>
            <EmptyState title="Plan not found" description="This plan may have been deleted." />
            <Button label="Back" variant="secondary" onPress={() => router.back()} />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Add Day',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
          <DayForm name={name} onChangeName={setName} />
        </ScrollView>
        <View style={[styles.footer, { borderTopColor: borderColor, backgroundColor: surfaceColor }]}>
          <Button label="Cancel" variant="secondary" onPress={() => router.back()} style={styles.fullWidth} />
          <Button label="Save" onPress={() => void handleSave()} style={styles.fullWidth} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
    flexGrow: 1,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
});

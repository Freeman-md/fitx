import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BlockForm } from '@/features/plan/components/BlockForm';
import { useDayBlocks } from '@/features/plan/hooks/use-day-blocks';
import { getDurationAlert, getRequiredNameAlert, parsePositiveNumber } from '@/features/plan/utils/validation';

export default function CreateBlockScreen() {
  const router = useRouter();
  const { planId, dayId } = useLocalSearchParams<{ planId: string; dayId: string }>();
  const { currentPlan, currentDay, addBlock } = useDayBlocks(planId, dayId);
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const surfaceColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  const handleSave = async () => {
    const titleError = getRequiredNameAlert('Block title', title);
    if (titleError) {
      Alert.alert(titleError.title, titleError.message);
      return;
    }
    const duration = parsePositiveNumber(durationMinutes);
    if (!duration) {
      const durationError = getDurationAlert();
      Alert.alert(durationError.title, durationError.message);
      return;
    }
    const added = await addBlock(title.trim(), duration);
    if (added) {
      router.back();
    }
  };

  if (!currentPlan || !currentDay) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Add Block',
            headerBackTitle: 'Back',
            headerBackTitleVisible: true,
          }}
        />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.container}>
            <EmptyState title="Day not found" description="This day may have been deleted." />
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
          title: 'Add Block',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
          <BlockForm
            title={title}
            durationMinutes={durationMinutes}
            onChangeTitle={setTitle}
            onChangeDuration={setDurationMinutes}
          />
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

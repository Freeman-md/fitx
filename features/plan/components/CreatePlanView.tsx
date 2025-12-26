import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
type CreatePlanViewProps = {
  nameInput: string;
  gymTypeInput: string;
  onChangeName: (value: string) => void;
  onChangeGymType: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function CreatePlanView({
  nameInput,
  gymTypeInput,
  onChangeName,
  onChangeGymType,
  onSave,
  onCancel,
}: CreatePlanViewProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const surfaceColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;
  const inputStyle = [styles.input, { borderColor, color: textColor }];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
          <View style={styles.section}>
            <TextInput
              placeholder="Plan name"
              placeholderTextColor={placeholderColor}
              value={nameInput}
              onChangeText={onChangeName}
              style={inputStyle}
            />
            <TextInput
              placeholder="Gym type (optional)"
              placeholderTextColor={placeholderColor}
              value={gymTypeInput}
              onChangeText={onChangeGymType}
              style={inputStyle}
            />
          </View>
        </ScrollView>
        <View style={[styles.footer, { borderTopColor: borderColor, backgroundColor: surfaceColor }]}>
          <Button label="Cancel" variant="secondary" onPress={onCancel} style={styles.fullWidth} />
          <Button label="Save" onPress={onSave} style={styles.fullWidth} />
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
  section: {
    gap: Spacing.sm,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});

import { StyleSheet, TextInput, View } from 'react-native';

import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SecondaryText } from '@/components/ui/text';
type CreatePlanViewProps = {
  nameInput: string;
  gymTypeInput: string;
  onChangeName: (value: string) => void;
  onChangeGymType: (value: string) => void;
};

export function CreatePlanView({
  nameInput,
  gymTypeInput,
  onChangeName,
  onChangeGymType,
}: CreatePlanViewProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const inputStyle = [styles.input, { borderColor, color: textColor }];

  return (
    <View style={styles.section}>
      <SecondaryText>Plan name</SecondaryText>
      <TextInput
        placeholder="Plan name"
        placeholderTextColor={placeholderColor}
        value={nameInput}
        onChangeText={onChangeName}
        style={inputStyle}
      />
      <SecondaryText>Gym type</SecondaryText>
      <TextInput
        placeholder="Gym type (optional)"
        placeholderTextColor={placeholderColor}
        value={gymTypeInput}
        onChangeText={onChangeGymType}
        style={inputStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});

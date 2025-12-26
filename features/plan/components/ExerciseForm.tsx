import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';

type ExerciseFormProps = {
  name: string;
  sets: string;
  repsMin: string;
  repsMax: string;
  timeSeconds: string;
  restSeconds: string;
  notes: string;
  mode: 'reps' | 'time';
  onChangeMode: (mode: 'reps' | 'time') => void;
  onChangeName: (value: string) => void;
  onChangeSets: (value: string) => void;
  onChangeRepsMin: (value: string) => void;
  onChangeRepsMax: (value: string) => void;
  onChangeTimeSeconds: (value: string) => void;
  onChangeRestSeconds: (value: string) => void;
  onChangeNotes: (value: string) => void;
};

export function ExerciseForm({
  name,
  sets,
  repsMin,
  repsMax,
  timeSeconds,
  restSeconds,
  notes,
  mode,
  onChangeMode,
  onChangeName,
  onChangeSets,
  onChangeRepsMin,
  onChangeRepsMax,
  onChangeTimeSeconds,
  onChangeRestSeconds,
  onChangeNotes,
}: ExerciseFormProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const inputStyle = [styles.input, { borderColor, color: textColor }];

  return (
    <View style={styles.section}>
      <TextInput
        placeholder="Exercise name"
        placeholderTextColor={placeholderColor}
        value={name}
        onChangeText={onChangeName}
        style={inputStyle}
      />
      <TextInput
        placeholder="Sets"
        placeholderTextColor={placeholderColor}
        value={sets}
        onChangeText={onChangeSets}
        keyboardType="number-pad"
        style={inputStyle}
      />
      <View style={styles.modeRow}>
        <Button
          label="Reps"
          size="compact"
          variant={mode === 'reps' ? 'primary' : 'secondary'}
          onPress={() => onChangeMode('reps')}
        />
        <Button
          label="Time"
          size="compact"
          variant={mode === 'time' ? 'primary' : 'secondary'}
          onPress={() => onChangeMode('time')}
        />
      </View>
      {mode === 'reps' ? (
        <>
          <TextInput
            placeholder="Reps min"
            placeholderTextColor={placeholderColor}
            value={repsMin}
            onChangeText={onChangeRepsMin}
            keyboardType="number-pad"
            style={inputStyle}
          />
          <TextInput
            placeholder="Reps max"
            placeholderTextColor={placeholderColor}
            value={repsMax}
            onChangeText={onChangeRepsMax}
            keyboardType="number-pad"
            style={inputStyle}
          />
        </>
      ) : (
        <TextInput
          placeholder="Time (seconds)"
          placeholderTextColor={placeholderColor}
          value={timeSeconds}
          onChangeText={onChangeTimeSeconds}
          keyboardType="number-pad"
          style={inputStyle}
        />
      )}
      <TextInput
        placeholder="Rest (seconds)"
        placeholderTextColor={placeholderColor}
        value={restSeconds}
        onChangeText={onChangeRestSeconds}
        keyboardType="number-pad"
        style={inputStyle}
      />
      <TextInput
        placeholder="Notes"
        placeholderTextColor={placeholderColor}
        value={notes}
        onChangeText={onChangeNotes}
        style={inputStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
  },
  modeRow: {
    flexDirection: 'row',
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

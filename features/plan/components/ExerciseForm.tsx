import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';
import { FormField } from '@/components/ui/form-field';
import { SliderField } from '@/components/ui/slider-field';

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
  onBlurName?: () => void;
  nameError?: string;
  setsError?: string;
  repsMinError?: string;
  repsMaxError?: string;
  timeError?: string;
  restError?: string;
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
  onBlurName,
  nameError,
  setsError,
  repsMinError,
  repsMaxError,
  timeError,
  restError,
}: ExerciseFormProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const errorBorderColor = colorScheme === 'dark' ? '#f87171' : '#dc2626';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const inputStyle = [styles.input, { borderColor, color: textColor }];
  const setsValue = Math.min(10, Math.max(1, Number(sets || 1)));
  const repsMinValue = Math.min(20, Math.max(1, Number(repsMin || 1)));
  const repsMaxValue = Math.min(20, Math.max(1, Number(repsMax || 1)));
  const restValue = Math.min(180, Math.max(0, Number(restSeconds || 0)));

  return (
    <View style={styles.section}>
      <FormField label="Exercise name" error={nameError}>
        <TextInput
          placeholder="Exercise name"
          placeholderTextColor={placeholderColor}
          value={name}
          onChangeText={onChangeName}
          onBlur={onBlurName}
          style={[
            inputStyle,
            nameError ? { borderColor: errorBorderColor } : null,
          ]}
        />
      </FormField>
      <SliderField
        label="Sets"
        value={setsValue}
        min={1}
        max={10}
        step={1}
        onChange={(value) => onChangeSets(String(value))}
        valueLabel={sets ? `${sets} sets` : 'Select sets'}
        error={setsError}
      />
      <FormField label="Target type">
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
      </FormField>
      {mode === 'reps' ? (
        <>
          <SliderField
            label="Reps min"
            value={repsMinValue}
            min={1}
            max={20}
            step={1}
            onChange={(value) => onChangeRepsMin(String(value))}
            valueLabel={repsMin ? `${repsMin} reps` : 'Select min'}
            error={repsMinError}
          />
          <SliderField
            label="Reps max"
            value={repsMaxValue}
            min={1}
            max={20}
            step={1}
            onChange={(value) => onChangeRepsMax(String(value))}
            valueLabel={repsMax ? `${repsMax} reps` : 'Select max'}
            error={repsMaxError}
          />
        </>
      ) : (
        <FormField label="Time seconds" error={timeError} helper="Used for timed exercises">
          <TextInput
            placeholder="Time (seconds)"
            placeholderTextColor={placeholderColor}
            value={timeSeconds}
            onChangeText={onChangeTimeSeconds}
            keyboardType="number-pad"
            style={[
              inputStyle,
              timeError ? { borderColor: errorBorderColor } : null,
            ]}
          />
        </FormField>
      )}
      <SliderField
        label="Rest seconds"
        value={restValue}
        min={0}
        max={180}
        step={15}
        onChange={(value) => onChangeRestSeconds(String(value))}
        valueLabel={restSeconds ? `${restSeconds} sec rest` : 'Select rest'}
        error={restError}
      />
      <FormField label="Notes">
        <TextInput
          placeholder="Notes"
          placeholderTextColor={placeholderColor}
          value={notes}
          onChangeText={onChangeNotes}
          style={inputStyle}
        />
      </FormField>
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

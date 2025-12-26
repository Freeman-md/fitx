import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WorkoutDay } from '@/data/models';
import type { DayEdit } from '@/features/plan/hooks/use-plan-days';
import { DayCard } from '@/features/plan/components/DayCard';
import { DayForm } from '@/features/plan/components/DayForm';
import { Button } from '@/components/ui/button';
import { PageTitle, PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type PlanDaysViewProps = {
  planName?: string;
  gymType?: string;
  days: WorkoutDay[];
  editingDay: DayEdit | null;
  newDayName: string;
  onChangeNewDayName: (value: string) => void;
  onAddDay: () => void;
  onChangeEditingName: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onMoveDayUp: (dayId: string) => void;
  onMoveDayDown: (dayId: string) => void;
  onOpenBlocks: (dayId: string) => void;
  onStartEdit: (dayId: string, dayName: string) => void;
  onDeleteDay: (dayId: string, dayName: string) => void;
  onBack: () => void;
  isMissing: boolean;
};

export function PlanDaysView({
  planName,
  gymType,
  days,
  editingDay,
  newDayName,
  onChangeNewDayName,
  onAddDay,
  onChangeEditingName,
  onCancelEdit,
  onSaveEdit,
  onMoveDayUp,
  onMoveDayDown,
  onOpenBlocks,
  onStartEdit,
  onDeleteDay,
  onBack,
  isMissing,
}: PlanDaysViewProps) {
  if (isMissing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <SecondaryText>Plan not found.</SecondaryText>
          <Button label="Back to Plans" onPress={onBack} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <PageTitle>{planName}</PageTitle>
        {gymType ? <SecondaryText style={styles.subtitle}>{gymType}</SecondaryText> : null}
        <View style={styles.section}>
          <DayForm
            name={newDayName}
            onChangeName={onChangeNewDayName}
            onSubmit={onAddDay}
            submitLabel="Add Day"
          />
        </View>
        <View style={styles.section}>
          {days.length === 0 ? (
            <SecondaryText style={styles.centeredText}>No days yet.</SecondaryText>
          ) : (
            days.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                isEditing={editingDay?.id === day.id}
                editingName={editingDay?.id === day.id ? editingDay.name : day.name}
                onChangeName={onChangeEditingName}
                onCancelEdit={onCancelEdit}
                onSaveEdit={onSaveEdit}
                onMoveUp={() => onMoveDayUp(day.id)}
                onMoveDown={() => onMoveDayDown(day.id)}
                onOpenBlocks={() => onOpenBlocks(day.id)}
                onStartEdit={() => onStartEdit(day.id, day.name)}
                onDelete={() => onDeleteDay(day.id, day.name)}
              />
            ))
          )}
        </View>
      </ScrollView>
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
  },
  section: {
    gap: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});

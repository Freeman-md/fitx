import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WorkoutDay } from '@/data/models';
import type { DayEdit } from '@/features/plan/hooks/use-plan-days';
import { DayCard } from '@/features/plan/components/DayCard';
import { DayForm } from '@/features/plan/components/DayForm';

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
          <Text>Plan not found.</Text>
          <Button title="Back to Plans" onPress={onBack} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>{planName}</Text>
        {gymType ? <Text style={styles.subtitle}>{gymType}</Text> : null}
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
            <Text>No days yet.</Text>
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
    padding: 16,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.7,
  },
  section: {
    gap: 12,
  },
});

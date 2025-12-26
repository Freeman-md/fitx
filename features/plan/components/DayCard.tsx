import { Pressable, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import type { WorkoutDay } from '@/data/models';
import { Card } from '@/components/ui/card';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type DayCardProps = {
  day: WorkoutDay;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenBlocks: () => void;
  onEdit: () => void;
};

export function DayCard({ day, onMoveUp, onMoveDown, onOpenBlocks, onEdit }: DayCardProps) {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onOpenBlocks}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.info}>
            <PrimaryText style={styles.title}>{day.name}</PrimaryText>
            <SecondaryText style={styles.meta}>{`Day ${day.order}`}</SecondaryText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={iconColor} />
        </View>
        <View style={styles.actionsRow}>
          <MaterialIcons name="drag-handle" size={18} color={iconColor} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Move day up"
            onPress={(event) => {
              event.stopPropagation();
              onMoveUp();
            }}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}>
            <MaterialIcons name="keyboard-arrow-up" size={20} color={iconColor} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Move day down"
            onPress={(event) => {
              event.stopPropagation();
              onMoveDown();
            }}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={iconColor} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit day"
            onPress={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}>
            <MaterialIcons name="more-vert" size={20} color={iconColor} />
          </Pressable>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.92,
  },
  card: {
    borderWidth: 0,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    fontWeight: '600',
  },
  meta: {
    opacity: 0.75,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.xs,
  },
  iconButton: {
    padding: Spacing.xs,
    borderRadius: 12,
  },
  iconPressed: {
    opacity: 0.7,
  },
});

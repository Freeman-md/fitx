import { Pressable, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import type { Block } from '@/data/models';
import { Card } from '@/components/ui/card';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type BlockCardProps = {
  block: Block;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenExercises: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function BlockCard({
  block,
  onMoveUp,
  onMoveDown,
  onOpenExercises,
  onEdit,
  onDelete,
}: BlockCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? Colors.dark.icon : Colors.light.icon;
  const editColor = isDark ? '#60a5fa' : '#2563eb';
  const deleteColor = isDark ? '#f87171' : '#dc2626';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onOpenExercises}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.info}>
            <PrimaryText style={styles.title}>{block.title}</PrimaryText>
            <SecondaryText style={styles.meta}>
              {block.durationMinutes}m · {`Block ${block.order}`}
            </SecondaryText>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={iconColor} />
        </View>
        <View style={styles.actionsRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Move block up"
            onPress={(event) => {
              event.stopPropagation();
              onMoveUp();
            }}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}>
            <MaterialIcons name="arrow-upward" size={18} color={iconColor} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Move block down"
            onPress={(event) => {
              event.stopPropagation();
              onMoveDown();
            }}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}>
            <MaterialIcons name="arrow-downward" size={18} color={iconColor} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit block"
            onPress={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}>
            <MaterialIcons name="edit" size={18} color={editColor} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete block"
            onPress={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}>
            <MaterialIcons name="delete" size={18} color={deleteColor} />
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

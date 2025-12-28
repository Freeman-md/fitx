import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Block, WorkoutDay, WorkoutPlan } from '@/data/models';
import { BlockCard } from '@/features/plan/components/BlockCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { PageTitle, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type DayBlocksViewProps = {
  plan: WorkoutPlan | null;
  day: WorkoutDay | null;
  blocks: Block[];
  onAddBlock: () => void;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onShowExercises: (blockId: string) => void;
  onEditBlock: (block: Block) => void;
  onDeleteBlock: (blockId: string, blockTitle: string) => void;
  onBack: () => void;
};

export function DayBlocksView({
  plan,
  day,
  blocks,
  onAddBlock,
  onMoveUp,
  onMoveDown,
  onShowExercises,
  onEditBlock,
  onDeleteBlock,
  onBack,
}: DayBlocksViewProps) {
  if (!plan || !day) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <SecondaryText>Day not found.</SecondaryText>
          <Button label="Back" onPress={onBack} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
          <View style={styles.context}>
            <Button label="Back to Days" onPress={onBack} variant="secondary" size="compact" />
            <PageTitle style={styles.dayName}>{day.name}</PageTitle>
            <SecondaryText style={styles.subtitle}>
              {plan.gymType ? `${plan.name} · ${plan.gymType}` : plan.name}
            </SecondaryText>
          </View>
          <View style={styles.section}>
            <SectionTitle>Blocks</SectionTitle>
            <SecondaryText>Tap a block to edit its exercises.</SecondaryText>
          </View>
          <View style={styles.section}>
            {blocks.length === 0 ? (
              <EmptyState
                title="No blocks yet"
                description="Add a block to organize your exercises."
                actionLabel="Create your first block"
                onAction={onAddBlock}
                size="section"
              />
            ) : (
              blocks.map((block) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onMoveUp={() => onMoveUp(block.id)}
                  onMoveDown={() => onMoveDown(block.id)}
                  onOpenExercises={() => onShowExercises(block.id)}
                  onEdit={() => onEditBlock(block)}
                  onDelete={() => onDeleteBlock(block.id, block.title)}
                />
              ))
            )}
          </View>
        </ScrollView>
        {blocks.length > 0 ? (
          <Fab accessibilityLabel="Add block" label="New Block" onPress={onAddBlock} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  context: {
    gap: Spacing.xs,
  },
  dayName: {
    textAlign: 'left',
    opacity: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  section: {
    gap: Spacing.sm,
  },
  subtitle: {
    opacity: 0.75,
  },
});

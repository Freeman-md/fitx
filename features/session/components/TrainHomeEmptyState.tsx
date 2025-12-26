import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/components/ui/spacing';

type TrainHomeEmptyStateProps = {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
};

export function TrainHomeEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: TrainHomeEmptyStateProps) {
  return (
    <View style={styles.container}>
      <EmptyState title={title} description={description} />
      <Button label={actionLabel} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
});

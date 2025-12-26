import { StyleSheet, View } from 'react-native';

import { PageTitle, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <PageTitle>{title}</PageTitle>
      {description ? <SecondaryText style={styles.description}>{description}</SecondaryText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  description: {
    textAlign: 'center',
  },
});

import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

import { SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type BottomSheetProps = {
  visible: boolean;
  title: string;
  onDismiss: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function BottomSheet({ visible, title, onDismiss, children, footer }: BottomSheetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  const borderColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}>
          <View style={[styles.sheet, { backgroundColor, borderColor }]}>
            <View style={styles.header}>
              <SectionTitle>{title}</SectionTitle>
            </View>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
            {footer ? (
              <View style={[styles.footer, { borderTopColor: borderColor }]}>{footer}</View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    maxHeight: '85%',
  },
  header: {
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
  content: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
});

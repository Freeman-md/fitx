import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

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
  const screenHeight = Dimensions.get('window').height;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.setValue(screenHeight);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsMounted(false);
      }
    });
  }, [visible, overlayOpacity, translateY, screenHeight]);

  if (!isMounted) {
    return null;
  }

  const minHeight = Math.round(Dimensions.get('window').height * 0.4);

  return (
    <Modal
      transparent
      visible={isMounted}
      animationType="none"
      onRequestClose={onDismiss}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}>
          <Animated.View
            style={[
              styles.sheet,
              { backgroundColor, borderColor, minHeight, transform: [{ translateY }] },
            ]}>
            <View style={styles.header}>
              <SectionTitle>{title}</SectionTitle>
            </View>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
            {footer ? (
              <View style={[styles.footer, { borderTopColor: borderColor }]}>{footer}</View>
            ) : null}
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
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

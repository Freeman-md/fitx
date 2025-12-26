import { ColorSchemeName, Pressable, StyleSheet, Text, type TextStyle, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';
type ButtonSize = 'default' | 'compact';

type ButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = getButtonColors(variant, colorScheme);
  const sizingStyles = size === 'compact' ? styles.compact : styles.defaultSize;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        sizingStyles,
        colors.container,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Text
        style={[
          styles.text,
          colors.text,
          size === 'compact' ? styles.textCompact : null,
          disabled && styles.textDisabled,
          textStyle,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const getButtonColors = (variant: ButtonVariant, colorScheme: ColorSchemeName) => {
  const isDark = colorScheme === 'dark';
  const palette = {
    primary: {
      container: {
        backgroundColor: isDark ? '#f3f4f6' : '#111827',
      },
      text: {
        color: isDark ? '#111827' : '#ffffff',
      },
    },
    secondary: {
      container: {
        backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
        borderWidth: 1,
        borderColor: isDark ? '#374151' : '#d1d5db',
      },
      text: {
        color: isDark ? Colors.dark.text : '#111827',
      },
    },
    destructive: {
      container: {
        backgroundColor: isDark ? '#b91c1c' : '#dc2626',
      },
      text: {
        color: '#ffffff',
      },
    },
  };
  return palette[variant];
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  defaultSize: {
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  compact: {
    minHeight: 36,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textCompact: {
    fontSize: 14,
  },
  textDisabled: {
    opacity: 0.9,
  },
});

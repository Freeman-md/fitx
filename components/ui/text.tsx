import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type StyledTextProps = TextProps & {
  children: React.ReactNode;
};

const useTextColors = () => {
  const colorScheme = useColorScheme();
  return {
    primary: colorScheme === 'dark' ? Colors.dark.text : undefined,
    secondary: colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon,
  };
};

export function PageTitle({ children, style, ...props }: StyledTextProps) {
  const { primary } = useTextColors();
  return (
    <Text style={[styles.pageTitle, primary ? { color: primary } : null, style]} {...props}>
      {children}
    </Text>
  );
}

export function SectionTitle({ children, style, ...props }: StyledTextProps) {
  const { primary } = useTextColors();
  return (
    <Text style={[styles.sectionTitle, primary ? { color: primary } : null, style]} {...props}>
      {children}
    </Text>
  );
}

export function PrimaryText({ children, style, ...props }: StyledTextProps) {
  const { primary } = useTextColors();
  return (
    <Text style={[styles.primaryText, primary ? { color: primary } : null, style]} {...props}>
      {children}
    </Text>
  );
}

export function SecondaryText({ children, style, ...props }: StyledTextProps) {
  const { secondary } = useTextColors();
  return (
    <Text style={[styles.secondaryText, secondary ? { color: secondary } : null, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryText: {
    fontSize: 14,
  },
  secondaryText: {
    fontSize: 12,
  },
});

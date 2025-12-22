import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type StyledTextProps = TextProps & {
  children: React.ReactNode;
};

export function SectionTitle({ children, style, ...props }: StyledTextProps) {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.dark.text : undefined;
  return (
    <Text style={[styles.sectionTitle, textColor ? { color: textColor } : null, style]} {...props}>
      {children}
    </Text>
  );
}

export function RowText({ children, style, ...props }: StyledTextProps) {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.dark.text : undefined;
  return (
    <Text style={[styles.rowText, textColor ? { color: textColor } : null, style]} {...props}>
      {children}
    </Text>
  );
}

export function StatusText({ children, style, ...props }: StyledTextProps) {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.dark.text : undefined;
  return (
    <Text style={[styles.statusText, textColor ? { color: textColor } : null, style]} {...props}>
      {children}
    </Text>
  );
}

export function DetailText({ children, style, ...props }: StyledTextProps) {
  const colorScheme = useColorScheme();
  const detailColor = colorScheme === 'dark' ? Colors.dark.icon : '#555';
  return (
    <Text style={[styles.detailText, { color: detailColor }, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: '600',
  },
  rowText: {
    fontSize: 14,
  },
  statusText: {
    textAlign: 'center',
  },
  detailText: {
    fontSize: 12,
  },
});

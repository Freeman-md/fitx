import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

type StyledTextProps = TextProps & {
  children: React.ReactNode;
};

export function SectionTitle({ children, style, ...props }: StyledTextProps) {
  return (
    <Text style={[styles.sectionTitle, style]} {...props}>
      {children}
    </Text>
  );
}

export function RowText({ children, style, ...props }: StyledTextProps) {
  return (
    <Text style={[styles.rowText, style]} {...props}>
      {children}
    </Text>
  );
}

export function StatusText({ children, style, ...props }: StyledTextProps) {
  return (
    <Text style={[styles.statusText, style]} {...props}>
      {children}
    </Text>
  );
}

export function DetailText({ children, style, ...props }: StyledTextProps) {
  const colorScheme = useColorScheme();
  const detailColor = colorScheme === 'dark' ? '#9ca3af' : '#555';
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

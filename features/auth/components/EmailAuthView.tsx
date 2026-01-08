import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/ui/form-field';
import { FormFooter } from '@/components/ui/form-footer';
import { PageTitle, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type EmailAuthViewProps = {
  email: string;
  password: string;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onBlurEmail?: () => void;
  onBlurPassword?: () => void;
  emailError?: string;
  passwordError?: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryLabel: string;
  secondaryLabel: string;
  primaryDisabled?: boolean;
  helper?: string;
};

export function EmailAuthView({
  email,
  password,
  onChangeEmail,
  onChangePassword,
  onBlurEmail,
  onBlurPassword,
  emailError,
  passwordError,
  onPrimary,
  onSecondary,
  primaryLabel,
  secondaryLabel,
  primaryDisabled,
  helper,
}: EmailAuthViewProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const errorBorderColor = colorScheme === 'dark' ? '#f87171' : '#dc2626';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const placeholderColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const inputStyle = [styles.input, { borderColor, color: textColor }];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          {helper ? <SecondaryText style={styles.subtitle}>{helper}</SecondaryText> : null}
        </View>
        <View style={styles.fields}>
          <FormField label="Email" error={emailError}>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={placeholderColor}
              value={email}
              onChangeText={onChangeEmail}
              onBlur={onBlurEmail}
              style={[inputStyle, emailError ? { borderColor: errorBorderColor } : null]}
            />
          </FormField>
          <FormField label="Password" error={passwordError}>
            <TextInput
              autoCapitalize="none"
              secureTextEntry
              placeholder="Password"
              placeholderTextColor={placeholderColor}
              value={password}
              onChangeText={onChangePassword}
              onBlur={onBlurPassword}
              style={[inputStyle, passwordError ? { borderColor: errorBorderColor } : null]}
            />
          </FormField>
        </View>
        <View style={styles.footer}>
          <FormFooter
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            onPrimary={onPrimary}
            onSecondary={onSecondary}
            primaryDisabled={primaryDisabled}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
  },
  fields: {
    gap: Spacing.md,
  },
  footer: {
    marginTop: 'auto',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});

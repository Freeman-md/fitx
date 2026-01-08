import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { EmailAuthView } from '@/features/auth/components/EmailAuthView';
import { useAuth } from '@/features/auth/hooks/use-auth';

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export default function CreateAccountScreen() {
  const router = useRouter();
  const { createAccountWithEmail, hasFirebaseConfig, isSignedIn, isReady } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const trimmedEmail = email.trim();
  const emailError =
    emailTouched && trimmedEmail.length === 0
      ? 'Email is required.'
      : emailTouched && !isValidEmail(trimmedEmail)
        ? 'Enter a valid email.'
        : '';
  const passwordError =
    passwordTouched && password.length === 0
      ? 'Password is required.'
      : passwordTouched && password.length < 6
        ? 'Password must be at least 6 characters.'
        : '';
  const isValid = trimmedEmail.length > 0 && isValidEmail(trimmedEmail) && password.length >= 6;

  const handlePrimary = async () => {
    if (!isValid) {
      return;
    }
    setErrorMessage('');
    const result = await createAccountWithEmail(trimmedEmail, password);
    if (result.ok) {
      router.replace('/account');
      return;
    }
    setErrorMessage(result.message ?? 'Unable to create account.');
  };

  const helper = !hasFirebaseConfig
    ? 'Firebase is not configured yet. Add your Firebase config to continue.'
    : 'Create an account to attach your workouts to an email.';

  useEffect(() => {
    if (!isReady || !isSignedIn) {
      return;
    }
    router.replace('/account');
  }, [isReady, isSignedIn, router]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create account',
          headerBackTitle: 'Back',
        }}
      />
      <EmailAuthView
        email={email}
        password={password}
        onChangeEmail={(value) => {
          setEmail(value);
          if (!emailTouched) {
            setEmailTouched(true);
          }
        }}
        onChangePassword={(value) => {
          setPassword(value);
          if (!passwordTouched) {
            setPasswordTouched(true);
          }
        }}
        onBlurEmail={() => setEmailTouched(true)}
        onBlurPassword={() => setPasswordTouched(true)}
        emailError={emailError}
        passwordError={passwordError || errorMessage}
        onPrimary={() => void handlePrimary()}
        onSecondary={() => router.push('/auth/sign-in')}
        primaryLabel="Create account"
        secondaryLabel="Sign in instead"
        primaryDisabled={!isValid || !hasFirebaseConfig}
        helper={helper}
      />
    </>
  );
}

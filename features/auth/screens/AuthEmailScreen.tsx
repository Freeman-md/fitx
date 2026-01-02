import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';

import { EmailAuthView } from '@/features/auth/components/EmailAuthView';
import { useAuth } from '@/features/auth/hooks/use-auth';

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export default function AuthEmailScreen() {
  const router = useRouter();
  const { signInWithEmail, createAccountWithEmail, hasFirebaseConfig } = useAuth();
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

    const signInResult = await signInWithEmail(trimmedEmail, password);

    console.log(signInResult)

    if (signInResult.ok) {
      router.replace('/account');
      return;
    }

    if (signInResult.code === 'auth/user-not-found') {
      const createResult = await createAccountWithEmail(trimmedEmail, password);

      if (createResult.ok) {
        router.replace('/account');
        return;
      }

      setErrorMessage(createResult.message ?? 'Unable to create account.');
      
      return;
    }

    setErrorMessage(signInResult.message ?? 'Unable to sign in.');
  };

  const helper = !hasFirebaseConfig
    ? 'Firebase is not configured yet. Add your Firebase config to continue.'
    : 'Enter your email and password to sign in.';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign in',
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
        onSecondary={() => router.back()}
        primaryLabel="Continue"
        secondaryLabel="Cancel"
        primaryDisabled={!isValid || !hasFirebaseConfig}
        helper={helper}
      />
    </>
  );
}

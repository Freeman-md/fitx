export type TrainColors = {
  border: string;
  inputBorder?: string;
  inputBackground?: string;
  inputText?: string;
  inputPlaceholder?: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string;
  buttonSecondaryBorder: string;
  buttonSecondaryText: string;
  buttonDestructiveBg: string;
  buttonDestructiveText: string;
};

export const getTrainColors = (colorScheme?: string | null): TrainColors => {
  if (colorScheme === 'dark') {
    return {
      border: '#374151',
      inputBorder: '#4b5563',
      inputBackground: '#111827',
      inputText: '#f9fafb',
      inputPlaceholder: '#9ca3af',
      buttonPrimaryBg: '#f3f4f6',
      buttonPrimaryText: '#111827',
      buttonSecondaryBg: '#1f2937',
      buttonSecondaryBorder: '#374151',
      buttonSecondaryText: '#e5e7eb',
      buttonDestructiveBg: '#b91c1c',
      buttonDestructiveText: '#ffffff',
    };
  }

  return {
    border: '#e5e7eb',
    inputBorder: '#ccc',
    inputBackground: undefined,
    inputText: undefined,
    inputPlaceholder: undefined,
    buttonPrimaryBg: '#111827',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: '#f3f4f6',
    buttonSecondaryBorder: '#d1d5db',
    buttonSecondaryText: '#111827',
    buttonDestructiveBg: '#dc2626',
    buttonDestructiveText: '#ffffff',
  };
};

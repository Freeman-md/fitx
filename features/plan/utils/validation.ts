export type AlertCopy = {
  title: string;
  message: string;
};

export const getRequiredNameAlert = (label: string, value: string): AlertCopy | null => {
  if (value.trim()) {
    return null;
  }
  return {
    title: `${label} required`,
    message: `Please enter a ${label.toLowerCase()}.`,
  };
};

export const parsePositiveNumber = (value: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export const getDurationAlert = (): AlertCopy => {
  return {
    title: 'Duration required',
    message: 'Please enter a valid duration in minutes.',
  };
};

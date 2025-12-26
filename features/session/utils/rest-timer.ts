export const getRestSecondsRemaining = (endsAt: string, now: number = Date.now()) => {
  return Math.max(0, Math.ceil((Date.parse(endsAt) - now) / 1000));
};

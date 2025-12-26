import type { SessionPosition } from '@/data/session-runner';

export const getSetNumber = (position: SessionPosition | null) => {
  return position ? position.setIndex + 1 : 0;
};

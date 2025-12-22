import { session, workoutPlan } from './sample-data';

export * from './models';
export * from './sample-data';

// Temporary validation until data wiring is in place.
export const __dataCheck = (() => {
  // eslint-disable-next-line no-console
  console.log('data check', { workoutPlan, session });
  return true;
})();

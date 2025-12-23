import { SessionStatus } from './models';
import type { Session, WorkoutPlan } from './models';

export const workoutPlan: WorkoutPlan = {
  id: 'plan-001',
  name: 'Strength + Conditioning',
  gymType: 'Full Gym',
  createdAt: '2025-02-01T08:00:00.000Z',
  updatedAt: '2025-02-05T08:00:00.000Z',
  days: [
    {
      id: 'day-001',
      name: 'Lower Body + Core',
      order: 1,
      blocks: [
        {
          id: 'block-001',
          title: 'Warmup',
          order: 1,
          durationMinutes: 10,
          exercises: [
            {
              id: 'ex-001',
              name: 'Rowing Machine',
              sets: 1,
              order: 1,
              timeSeconds: 600,
              restSeconds: 0,
              notes: 'Easy pace, nasal breathing.',
            },
          ],
        },
        {
          id: 'block-002',
          title: 'Strength',
          order: 2,
          durationMinutes: 35,
          exercises: [
            {
              id: 'ex-002',
              name: 'Back Squat',
              sets: 4,
              order: 1,
              repsMin: 5,
              repsMax: 8,
              restSeconds: 150,
              notes: 'Last set AMRAP leaving 1 rep in reserve.',
            },
            {
              id: 'ex-003',
              name: 'Romanian Deadlift',
              sets: 3,
              order: 2,
              repsMin: 8,
              repsMax: 10,
              restSeconds: 120,
            },
            {
              id: 'ex-004',
              name: 'Walking Lunges',
              sets: 3,
              order: 3,
              repsMin: 10,
              repsMax: 12,
              restSeconds: 90,
            },
          ],
        },
        {
          id: 'block-003',
          title: 'Core Finisher',
          order: 3,
          durationMinutes: 12,
          exercises: [
            {
              id: 'ex-005',
              name: 'Plank Hold',
              sets: 3,
              order: 1,
              timeSeconds: 45,
              restSeconds: 45,
            },
            {
              id: 'ex-006',
              name: 'Hanging Knee Raises',
              sets: 3,
              order: 2,
              repsMin: 8,
              repsMax: 12,
              restSeconds: 60,
            },
          ],
        },
      ],
    },
  ],
};

export const session: Session = {
  id: 'session-001',
  workoutPlanId: 'plan-001',
  workoutDayId: 'day-001',
  startedAt: '2025-02-10T07:30:00.000Z',
  status: SessionStatus.Active,
  blocks: [
    {
      blockId: 'block-001',
      startedAt: '2025-02-10T07:30:00.000Z',
      endedAt: '2025-02-10T07:40:00.000Z',
      exercises: [
        {
          exerciseId: 'ex-001',
          sets: [
            {
              setNumber: 1,
              targetTimeSeconds: 600,
              actualTimeSeconds: 600,
              completed: true,
              completedAt: '2025-02-10T07:40:00.000Z',
            },
          ],
        },
      ],
    },
    {
      blockId: 'block-002',
      startedAt: '2025-02-10T07:41:00.000Z',
      exercises: [
        {
          exerciseId: 'ex-002',
          sets: [
            {
              setNumber: 1,
              targetReps: 6,
              actualReps: 6,
              completed: true,
              completedAt: '2025-02-10T07:46:00.000Z',
            },
            {
              setNumber: 2,
              targetReps: 6,
              actualReps: 6,
              completed: true,
              completedAt: '2025-02-10T07:50:00.000Z',
            },
            {
              setNumber: 3,
              targetReps: 6,
              completed: false,
            },
            {
              setNumber: 4,
              targetReps: 6,
              completed: false,
            },
          ],
        },
        {
          exerciseId: 'ex-003',
          sets: [
            {
              setNumber: 1,
              targetReps: 8,
              completed: false,
            },
            {
              setNumber: 2,
              targetReps: 8,
              completed: false,
            },
            {
              setNumber: 3,
              targetReps: 8,
              completed: false,
            },
          ],
        },
      ],
    },
  ],
};

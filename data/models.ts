export interface WorkoutPlan {
  id: string;
  ownerId: string;
  name: string;
  gymType?: string;
  createdAt: string;
  updatedAt: string;
  // Plans fully own their days; there is no cross-plan sharing.
  days: WorkoutDay[];
}

export const Weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type Weekday = (typeof Weekdays)[number];

export interface WorkoutDay {
  id: string;
  name: string;
  weekday?: Weekday;
  order: number;
  updatedAt: string;
  // Days fully own their blocks; there is no cross-plan sharing.
  blocks: Block[];
}

export interface Block {
  id: string;
  title: string;
  order: number;
  durationMinutes: number;
  updatedAt: string;
  // Blocks fully own their exercises; there is no cross-plan sharing.
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  order: number;
  repsMin?: number;
  repsMax?: number;
  timeSeconds?: number;
  restSeconds: number;
  notes?: string;
  updatedAt: string;
}

export const SessionStatus = {
  Active: 'active',
  Completed: 'completed',
  Abandoned: 'abandoned',
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export interface Session {
  id: string;
  ownerId: string;
  workoutPlanId: string;
  workoutDayId: string;
  startedAt: string;
  endedAt?: string;
  updatedAt: string;
  // Sessions reference plans/days by ID only and are immutable once completed.
  status: SessionStatus;
  blocks: SessionBlock[];
}

export interface SessionBlock {
  blockId: string;
  startedAt: string;
  endedAt?: string;
  updatedAt: string;
  exercises: SessionExercise[];
}

export interface SessionExercise {
  exerciseId: string;
  updatedAt: string;
  sets: SessionSet[];
}

export interface SessionSet {
  setNumber: number;
  targetReps?: number;
  targetTimeSeconds?: number;
  actualReps?: number;
  actualTimeSeconds?: number;
  completed: boolean;
  completedAt?: string;
  updatedAt: string;
}

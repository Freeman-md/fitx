export interface WorkoutPlan {
  id: string;
  name: string;
  gymType?: string;
  // Plans fully own their days; there is no cross-plan sharing.
  days: WorkoutDay[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  // Days fully own their blocks; there is no cross-plan sharing.
  blocks: Block[];
}

export interface Block {
  id: string;
  title: string;
  durationMinutes: number;
  // Blocks fully own their exercises; there is no cross-plan sharing.
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repsMin?: number;
  repsMax?: number;
  timeSeconds?: number;
  restSeconds: number;
  notes?: string;
}

export const SessionStatus = {
  Active: 'active',
  Completed: 'completed',
  Abandoned: 'abandoned',
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export interface Session {
  id: string;
  workoutPlanId: string;
  workoutDayId: string;
  startedAt: string;
  endedAt?: string;
  // Sessions reference plans/days by ID only and are immutable once completed.
  status: SessionStatus;
  blocks: SessionBlock[];
}

export interface SessionBlock {
  blockId: string;
  startedAt: string;
  endedAt?: string;
  exercises: SessionExercise[];
}

export interface SessionExercise {
  exerciseId: string;
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
}

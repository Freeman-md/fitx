export interface WorkoutPlan {
  id: string;
  name: string;
  gymType?: string;
  days: WorkoutDay[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  blocks: Block[];
}

export interface Block {
  id: string;
  title: string;
  durationMinutes: number;
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

export interface Session {
  id: string;
  workoutPlanId: string;
  workoutDayId: string;
  startedAt: string;
  endedAt?: string;
  status: 'active' | 'completed' | 'abandoned';
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

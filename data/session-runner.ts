import type { Session, SessionBlock, SessionExercise, SessionSet } from './models';

export type SessionPosition = {
  blockIndex: number;
  exerciseIndex: number;
  setIndex: number;
};

export function isSetResolved(set: SessionSet): boolean {
  return set.completed || Boolean(set.completedAt);
}

export function findNextIncompleteSet(session: Session): SessionPosition | null {
  for (let blockIndex = 0; blockIndex < session.blocks.length; blockIndex += 1) {
    const block = session.blocks[blockIndex];
    for (let exerciseIndex = 0; exerciseIndex < block.exercises.length; exerciseIndex += 1) {
      const exercise = block.exercises[exerciseIndex];
      for (let setIndex = 0; setIndex < exercise.sets.length; setIndex += 1) {
        const set = exercise.sets[setIndex];
        if (!isSetResolved(set)) {
          return { blockIndex, exerciseIndex, setIndex };
        }
      }
    }
  }
  return null;
}

export function isSessionComplete(session: Session): boolean {
  return findNextIncompleteSet(session) === null;
}

export function updateSessionSet(
  session: Session,
  position: SessionPosition,
  updater: (set: SessionSet) => SessionSet
): Session {
  const blocks = session.blocks.map((block, blockIndex) => {
    if (blockIndex !== position.blockIndex) {
      return block;
    }
    const exercises = block.exercises.map((exercise, exerciseIndex) => {
      if (exerciseIndex !== position.exerciseIndex) {
        return exercise;
      }
      const sets = exercise.sets.map((set, setIndex) => {
        if (setIndex !== position.setIndex) {
          return set;
        }
        return updater(set);
      });
      return { ...exercise, sets };
    });
    return { ...block, exercises };
  });

  return { ...session, blocks };
}

export function getSessionBlock(session: Session, position: SessionPosition): SessionBlock {
  return session.blocks[position.blockIndex];
}

export function getSessionExercise(
  session: Session,
  position: SessionPosition
): SessionExercise {
  return getSessionBlock(session, position).exercises[position.exerciseIndex];
}

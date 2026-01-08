import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { runMirrorJob } from '@/data/mirror';

export const useMirrorJob = () => {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    let isActive = true;

    const runJob = () => {
      if (!isActive) {
        return;
      }
      void runMirrorJob();
    };

    runJob();

    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackground = appState.current === 'background' || appState.current === 'inactive';
      if (wasBackground && nextState === 'active') {
        runJob();
      }
      appState.current = nextState;
    });

    return () => {
      isActive = false;
      subscription.remove();
    };
  }, []);
};

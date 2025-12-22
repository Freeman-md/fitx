import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SessionStatus } from '@/data/models';
import { RowText, SectionTitle, StatusText } from '@/components/ui/text';
import { useTrainSession } from '@/hooks/use-train-session';

export default function TrainScreen() {
  const router = useRouter();
  const {
    plans,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlan,
    activeSession,
    activePosition,
    currentExerciseInfo,
    actualRepsInput,
    setActualRepsInput,
    actualTimeInput,
    setActualTimeInput,
    isResting,
    restSecondsRemaining,
    startSessionForDay,
    completeSet,
    skipSet,
    skipRest,
    endSession,
  } = useTrainSession({
    onSessionCompleted: () => {
      router.push('/session-summary');
    },
  });

  const handleEndSession = () => {
    if (!activeSession) {
      return;
    }

    Alert.alert('End Session', 'Do you want to complete or abandon this session?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Abandon',
        style: 'destructive',
        onPress: async () => {
          await endSession(SessionStatus.Abandoned);
        },
      },
      {
        text: 'Complete',
        onPress: async () => {
          await endSession(SessionStatus.Completed);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text>Train</Text>
      {activeSession && activeSession.status === SessionStatus.Active ? (
        <View style={styles.section}>
          <SectionTitle>Active Session</SectionTitle>
          {currentExerciseInfo ? (
            <>
              {isResting ? (
                <View style={styles.restContainer}>
                  <StatusText>Rest: {restSecondsRemaining}s</StatusText>
                  <Button title="Skip Rest" onPress={() => void skipRest()} />
                </View>
              ) : (
                <>
                  <StatusText>{currentExerciseInfo.name}</StatusText>
                  <StatusText>
                    Set {activePosition ? activePosition.setIndex + 1 : 0} of{' '}
                    {currentExerciseInfo.totalSets}
                  </StatusText>
                  <StatusText>Target: {currentExerciseInfo.target}</StatusText>
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder={currentExerciseInfo.usesTime ? 'Actual seconds' : 'Actual reps'}
                      value={currentExerciseInfo.usesTime ? actualTimeInput : actualRepsInput}
                      onChangeText={
                        currentExerciseInfo.usesTime ? setActualTimeInput : setActualRepsInput
                      }
                      keyboardType="number-pad"
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.buttonRow}>
                    <Button title="Complete Set" onPress={() => void completeSet()} />
                    <Button title="Skip Set" onPress={() => void skipSet()} />
                  </View>
                </>
              )}
              <View style={styles.endSessionRow}>
                <Button title="End Session" onPress={handleEndSession} />
              </View>
            </>
          ) : (
            <StatusText>Unable to load active session details.</StatusText>
          )}
        </View>
      ) : (
        <>
          <StatusText>No active session</StatusText>
          {plans.length === 0 ? (
            <StatusText>No plans available</StatusText>
          ) : (
            <View style={styles.section}>
              <SectionTitle>Plans</SectionTitle>
              {plans.map((plan) => (
                <View key={plan.id} style={styles.row}>
                  <RowText style={styles.rowText}>{plan.name}</RowText>
                  <Button title="Select" onPress={() => setSelectedPlanId(plan.id)} />
                </View>
              ))}
            </View>
          )}
          {selectedPlan ? (
            <View style={styles.section}>
              <SectionTitle>{selectedPlan.name} Days</SectionTitle>
              {selectedPlan.days.map((day) => (
                <View key={day.id} style={styles.row}>
                  <RowText style={styles.rowText}>{day.name}</RowText>
                  <Button
                    title="Start Session"
                    onPress={() => void startSessionForDay(selectedPlan.id, day.id)}
                  />
                </View>
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  section: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  inputRow: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  restContainer: {
    alignItems: 'center',
    gap: 12,
  },
  endSessionRow: {
    marginTop: 12,
  },
});

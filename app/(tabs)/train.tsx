import { StyleSheet, Text, View } from 'react-native';

export default function TrainScreen() {
  return (
    <View style={styles.container}>
      <Text>Train</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

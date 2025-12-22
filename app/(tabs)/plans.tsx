import { StyleSheet, Text, View } from 'react-native';

export default function PlansScreen() {
  return (
    <View style={styles.container}>
      <Text>Plans</Text>
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

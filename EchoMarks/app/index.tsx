import React from 'react';
import { StyleSheet, View } from 'react-native';
import App from '../components/App';

export default function Main() {
  return (
    <View style={styles.container}>
      <App />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

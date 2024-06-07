import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapComponent from '../components/MapComponent';

export default function App() {
  return (
    <View style={styles.container}>
      <MapComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

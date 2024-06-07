// RecordingButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface RecordingButtonProps {
  onPress: () => void;
  recording: boolean;
}

const RecordingButton: React.FC<RecordingButtonProps> = ({ onPress, recording }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: recording ? 'green' : 'black' }]} // Adjust background color dynamically
      onPress={onPress}
    >
      <MaterialIcons name={recording ? 'stop' : 'mic'} size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red', // Temporary color, will change based on recording state
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecordingButton;

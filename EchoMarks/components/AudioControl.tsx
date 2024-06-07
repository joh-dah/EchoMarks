// AudioControl.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AudioControlProps {
  fileName: string;
  onPlayPause: () => void;
  onDelete: () => void;
  isPlaying: boolean;
}

const AudioControl: React.FC<AudioControlProps> = ({ fileName, onPlayPause, onDelete, isPlaying }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.fileName}>{fileName}</Text>
      <TouchableOpacity style={styles.button} onPress={onPlayPause}>
        <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  fileName: {
    flex: 1,
    color: 'white',
  },
  button: {
    padding: 10,
  },
});

export default AudioControl;

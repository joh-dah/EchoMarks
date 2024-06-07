// AudioMarker.tsx
import React from 'react';
import { Marker } from 'react-native-maps';

interface AudioMarkerProps {
  coordinate: { latitude: number; longitude: number };
  onPress: () => void;
}

const AudioMarker: React.FC<AudioMarkerProps> = ({ coordinate, onPress }) => {
  return <Marker coordinate={coordinate} onPress={onPress} />;
};

export default AudioMarker;

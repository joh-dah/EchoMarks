// ResetLocationButton.tsx
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ResetLocationButtonProps {
  onPress: () => void;
}

const ResetLocationButton: React.FC<ResetLocationButtonProps> = ({ onPress }) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    await onPress();
    setLoading(false);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <MaterialIcons name="my-location" size={24} color="white" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 130,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#288ac7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResetLocationButton;

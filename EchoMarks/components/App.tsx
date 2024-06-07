// App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import MapComponent from './MapComponent';
import RecordingButton from './RecordingButton';
import AudioMarker from './AudioMarker';
import AudioControl from './AudioControl';
import ResetMapButton from './ResetMapButton';

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(null);
  const [soundFiles, setSoundFiles] = useState([]);
  const [selectedSoundFile, setSelectedSoundFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const mapRef = useRef(null);

 useEffect(() => {
 let locationSubscription;

 (async () => {
 let { status } = await Location.requestForegroundPermissionsAsync();
   if (status !== 'granted') {
     Alert.alert('Permission to access location was denied');
     return;
   }

   let location = await Location.getCurrentPositionAsync({});
   setLocation(location.coords);

   locationSubscription = await Location.watchPositionAsync(
     { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 10 },
     (newLocation) => {
       setLocation(newLocation.coords);
     }
   );
 })();

 return () => {
   if (locationSubscription) {
     locationSubscription.remove();
   }
   if (sound) {
     sound.unloadAsync();
   }
 };
}, [sound]);


  const resetToUserLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission denied');
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000,
        timeout: 5000,
      });
      if (!location) {
        throw new Error('Failed to get current location');
      }

      setLocation(location.coords);
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error resetting location:', error);
      Alert.alert('Error resetting location', error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleStartRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const handleStopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    if (location) {
      const newSoundFile = {
        uri,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      setSoundFiles([...soundFiles, newSoundFile]);
    }
  };

  const playPauseSound = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const selectSoundFile = async (file) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: file.uri });
    setSound(newSound);
    setSelectedSoundFile(file);
    setIsPlaying(false);
  };

  const deleteSoundFile = (file) => {
    setSoundFiles(soundFiles.filter(f => f !== file));
    if (selectedSoundFile === file) {
      setSelectedSoundFile(null);
      if (sound) {
        sound.unloadAsync();
      }
    }
  };

  return (
      <View style={styles.container}>
        <MapComponent location={location} ref={mapRef} />
        <RecordingButton
          onPress={recording ? handleStopRecording : handleStartRecording}
          recording={!!recording}
        />
        <ResetMapButton onPress={resetToUserLocation} />
        {soundFiles.map((file, index) => (
          <AudioMarker key={index} coordinate={{ latitude: file.latitude, longitude: file.longitude }} onPress={() => setSelectedSoundFile(file)} />
        ))}
        {selectedSoundFile && (
          <AudioControl
            fileName={`Audio ${soundFiles.indexOf(selectedSoundFile) + 1}`}
            onPlayPause={handlePlayPause}
            onDelete={handleDelete}
            isPlaying={isPlaying}
          />
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

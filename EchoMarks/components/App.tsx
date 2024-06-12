// App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [shouldResetLocation, setShouldResetLocation] = useState(false);
  const mapRef = useRef(null);

useEffect(() => {
  let locationSubscription;

  const fetchData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 10 },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );

      const storedSoundFiles = await AsyncStorage.getItem('soundFiles');
      if (storedSoundFiles) {
        setSoundFiles(JSON.parse(storedSoundFiles));
      }
    } catch (error) {
      console.error('Error loading sound files:', error);
    }
  };

  fetchData();

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


    const saveSoundFilesToStorage = async (files) => {
      try {
        await AsyncStorage.setItem('soundFiles', JSON.stringify(files));
        console.log('Sound files saved successfully');
      } catch (error) {
        console.error('Error saving sound files:', error);
      }
    };

    // Function to add a new sound file
    const addSoundFile = async (newSoundFile) => {
      setSoundFiles([...soundFiles, newSoundFile]);
      await saveSoundFilesToStorage([...soundFiles, newSoundFile]); // Save updated sound files to AsyncStorage
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
      addSoundFile(newSoundFile);
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

/*
old version
const deleteSoundFile = (file) => {
    setSoundFiles(soundFiles.filter(f => f !== file));
    if (selectedSoundFile === file) {
      setSelectedSoundFile(null);
      if (sound) {
        sound.unloadAsync();
      }
    }
  }; */

    // Function to delete a sound file
    const deleteSoundFile = (file) => {
      const updatedSoundFiles = soundFiles.filter((f) => f !== file);
      setSoundFiles(updatedSoundFiles);
      saveSoundFilesToStorage(updatedSoundFiles); // Save updated sound files to AsyncStorage
      if (selectedSoundFile === file) {
        setSelectedSoundFile(null);
        if (sound) {
          sound.unloadAsync();
        }
      }
    };

  return (
      <View style={styles.container}>
          <MapComponent
            location={location}
            soundFiles={soundFiles}
            onSelectSoundFile={selectSoundFile}
            ref={mapRef}
            shouldResetLocation={shouldResetLocation}
          />
        <RecordingButton
          onPress={recording ? handleStopRecording : handleStartRecording}
          recording={!!recording}
        />
        <ResetMapButton onPress={resetToUserLocation} setShouldResetLocation={setShouldResetLocation} />
        {soundFiles.map((file, index) => (
          <AudioMarker key={index} coordinate={{ latitude: file.latitude, longitude: file.longitude }} onPress={() => setSelectedSoundFile(file)} />
        ))}
      {selectedSoundFile && (
        <AudioControl
          fileName={`Audio ${soundFiles.indexOf(selectedSoundFile) + 1}`}
          onPlayPause={playPauseSound}
          onDelete={() => deleteSoundFile(selectedSoundFile)}
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

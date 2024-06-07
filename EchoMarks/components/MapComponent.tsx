import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

export default function MapComponent() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(null);
  const [soundFiles, setSoundFiles] = useState([]);
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
    };
  }, []);

  const resetToUserLocation = async () => {
    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000,
        timeout: 5000,
      });
      if (location) {
        setLocation(location.coords);
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        Alert.alert('Failed to get current location');
      }
    } catch (error) {
      Alert.alert('Error getting location', error.message);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
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

  const stopRecording = async () => {
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

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="You are here"
            pinColor="blue"
          />
          {soundFiles.map((file, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: file.latitude, longitude: file.longitude }}
              title={`Audio ${index + 1}`}
              pinColor="red"
              onPress={() => {
                const soundObject = new Audio.Sound();
                soundObject.loadAsync({ uri: file.uri }).then(() => {
                  soundObject.playAsync();
                });
              }}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.roundButton} onPress={resetToUserLocation}>
          <MaterialIcons name="my-location" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roundButton, styles.recordButton]}
          onPress={recording ? stopRecording : startRecording}
        >
          <MaterialIcons name={recording ? 'stop' : 'mic'} size={24} color="white" />
        </TouchableOpacity>
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  roundButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButton: {
    backgroundColor: 'red',
  },
});

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker, MapViewProps } from 'react-native-maps';

interface SoundFile {
  uri: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps extends MapViewProps {
  location: { latitude: number; longitude: number } | null;
  soundFiles: SoundFile[];
  onSelectSoundFile: (file: SoundFile) => void;
}

const MapComponent: React.ForwardRefRenderFunction<MapView, MapComponentProps> = (
  { location, soundFiles, onSelectSoundFile, ...props },
  ref
) => {
  const mapRef = useRef<MapView>(null);

  useImperativeHandle(ref, () => mapRef.current);

  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

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
          {...props}
        >
          {/*User Location Marker*/}
          <Marker
            coordinate={location}
            title="Your Location"
            anchor={{ x: 0.5, y: 0.5 }}
            description="This is your current location"
          >
            <Image
              source={require('../assets/images/user_location.png')}
              style={{ width: 25, height: 25 }}
            />
          </Marker>
            {/* Audio markers */}
            {soundFiles.map((file, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: file.latitude, longitude: file.longitude }}
                title={`Audio ${index + 1}`}
                onPress={() => onSelectSoundFile(file)}
              />
              ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

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
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default forwardRef(MapComponent);

import React,{useState,useEffect} from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import MapView,{Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const INITIAL_LATITUDE = 65.0800;
const INITIAL_LONGITUDE = 25.4800;
const INITIAL_LATITUDE_DELTA = 0.0922;
const INITIAL_LONGITUDE_DELTA = 0.0421;

export default function App() {
  const [latitude, setLatitude] = useState(INITIAL_LATITUDE);
  const [longitude, setLongitude] = useState(INITIAL_LONGITUDE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    (async() => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      try {
        if (status !== 'granted') {
          setIsLoading(false);
          alert("Geolocation failed.");
          return;
        }

        const location = await Location.getLastKnownPositionAsync({accuracy: Location.Accuracy.High});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        setIsLoading(false);
      } catch (error) {
        alert(error);
        setIsLoading(false);
      }
    })();
  },[])

  if (isLoading) {
    return <View style={styles.container}><Text>Retrieving location...</Text></View>
  } else {
    return (
      <View style={styles.container}>
        <MapView 
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: INITIAL_LATITUDE_DELTA,
            longitudeDelta: INITIAL_LONGITUDE_DELTA,
          }} 
        >
          <Marker 
            title="testing"
            coordinate={{latitude: latitude,longitude: longitude}}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - Constants.statusBarHeight,
  },
});
/*
## MAPVIEW
- this enables the user to preview a location on the map based on parameter
or select a location on the map ang get the coordinates ang other info

## INSTALLATION
expo install react-native-maps
*/
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = props => {
  const [selectedLocation, setSelectedLocation] = useState();

  const mapRegion = {
    latitude: 37.78,
    longitude: -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const selectLocationHandler = (event) => {
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    })
  }

  let markerCoordinates;
  if(selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    }
  }

  return (
    <MapView region={mapRegion} onPress={selectLocationHandler}>
      {markerCoordinates && <Marker title='Picked location' coodinate={markerCoordinates}></Marker>}
    </MapView>
  )
}

export default MapScreen;

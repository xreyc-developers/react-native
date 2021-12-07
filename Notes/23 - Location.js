/*
## LOCATION
- this gets the current location of the device

## INSTALLATION
expo install expo-location
*/
import { View, Button, Text, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const LocationPicker = props => {
  const [pickedLocation, setPickedLocation] = useState();

  let imagePreviewUrl;
  if(pickedLocation) {
    imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${pickedLocation.lat},${pickedLocation.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:C%7C${pickedLocation.lat},${pickedLocation.lng}&key=YOUR_API_KEY`;
  }

  // # PERMISSION (CREATE PERMISSION)
  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if(result.status !== 'granted') {
      Alert.alert('Insufficient permissions!', 'You need to grant location permissions', [{ text: 'Okay' }]);
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if(!hasPermission) {
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({ timeout: 5000 });
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    } catch (err) {
      Alert.alert('Could not fetch location', 'Please try again later',[{ text: 'Okay' }]);
    }
  }

  return (
    <View>
      <View>
        {!pickedLocation && <Text>No Location</Text>}
        {pickedLocation && <Text>{pickedLocation}</Text>}
        {pickedLocation && <Image source={{ uri: imagePreviewUrl }}/>}
      </View>
      <Button title="Get User Location" onPress={getLocationHandler}/>
    </View>
  )
}

export default LocationPicker;

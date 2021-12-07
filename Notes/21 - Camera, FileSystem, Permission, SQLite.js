/*
## CAMERA, PERMISSIONS AND FILESYSTEM

## INSTALLATION
expo install expo-image-picker
expo install expo-permissions
expo install expo-file-system
expo install expo-sqlite

## APPLICATION*/

////////// CAMERA //////////
// App.js
import * as ImagePicker from 'expo-mage-picker';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { init, insertPlace } from './helpers/db';

init().then(() => {
  console.log('initialize database');
})
.catch(err => {
  console.log('initialize failed', err);
})

const App = props => {
  const [pickedImage, setPickedImage] = useState();
  // OTHER DATA
  const [title, setTitle] = useState();
  const [imageUri, setImageUri] = useState();
  const [address, setAddress] = useState();
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  // # PERMISSION (CREATE PERMISSION)
  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if(result.status !== 'granted') {
      Alert.alert('Insufficient permissions!', 'You need to grant camera permissions', [{ text: 'Okay' }]);
      return false;
    }
    return true;
  };

  // # FILESYSTEM (SAVE IMAGE TO DEVICE)
  const onImageTaken = async (image) => {
    const fileName = image.split('/').pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      // MOVE FILE FROM TEMPORARY TO THE FILESYSTEM
      await FileSystem.moveAsync({
        from: image,
        to: newPath
      });
      const dbResult = await insertPlace(title, imageUri, address, lat, lng);
      setPickedImage(newPath);
    } catch (err) {
      console.log(err);
    }
  }

  // # CAMERA (CAPTURE IMAGE)
  const takeImageHandler = async () => {
    // CHECK PERMISSION
    const hasPermission = await verifyPermissions();
    if(!hasPermission) {
      return;
    }

    // WE CAN ACCESS THE IMAGE PROPERTY HERE
    // WE WILL BE ABLE TO GET THE TEMPORARY IMAGE LOCATION WHICH GETS DELETE AFTER
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5
    });

    // SET IMAGE URI
    // THE IMAGE URI IS JUST A TEMPORARY FILE LOCATION WHICH GETS DELETED OVERTIME
    onImageTaken(image.uri);
    // setPickedImage(image.uri);
  };

  // RENDER
  return (
    <View>
      <View>
        {!pickedImage && <Text>No image picked yet.</Text>}
        {pickedImage && <Image source={{ uri: pickedImage }}/>}
      </View>
      <Button title="Take image" onPress={takeImageHandler}/>
    </View>
  )
}


////////// SQLITE //////////
// helpers/db.js
import { SQLite } from 'expo-sqlite';

const db = SQLite.openDatabase('places.db');

export const init = () => {

  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);',
        [],
        () => {
          // SUCCESS
          resolve();
        },
        (_, err) => {
          // ERROR
          reject(err);
        }
      )
    });
  });

  return promise;
}


export const insertPlace = (title, imageUri, address, lat, lng) {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)',
        [title, imageUri, address, lat, lng],
        (_, result) => {
          // SUCCESS
          resolve(result);
        },
        (_, err) => {
          // ERROR
          reject(err);
        }
      )
    });
  });

  return promise;
}





/*
## NOTES
- you can slice all the functionality into multiple file
- for sqlite, create folder 'helpers/db.js'
*/

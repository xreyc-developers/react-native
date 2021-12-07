// SQLITE AND REDUX
// SQLite and redux must be synced all the time if you use both of them at all times


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

// USUAL USAGE
// AT STARTING OF AN THE APP, WE SHOULD INSERT IT ON THE REDUX
export const fetchPlaces = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM places',
        [],
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
};


///////////// AT REDUX /////////////
// @ places-actions.js
export const loadPlaces = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchPlaces();
      dispatch({ type: 'SET_PLACES', places: dbResult.rows._array })
    } catch (err) {
      console.log(err);
    }
  }
}

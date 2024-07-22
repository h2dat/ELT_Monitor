import React, {useEffect, useState} from 'react';
import {collection, getDocs} from 'firebase/firestore';
import {FIREBASE_STORE} from '../FirbaseConfig';
const db = FIREBASE_STORE;

export const getStoreData = ({uid}) => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, `sensor_data/${uid}/data/`),
        );
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSensorData(data);
      } catch (error) {
        console.error('Error fetching sensor data: ', error);
      }
    };

    if (uid) {
      fetchSensorData();
    }
  }, [uid]);

  return sensorData;
};

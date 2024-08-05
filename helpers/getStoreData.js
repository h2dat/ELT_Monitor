import React, {useEffect, useState} from 'react';
import {collection, getDocs, getDoc, doc} from 'firebase/firestore';
import {FIREBASE_STORE} from '../FirbaseConfig';
const db = FIREBASE_STORE;

export const getStoreData = ({pathData}) => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, pathData),
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

    if (pathData) {
      fetchSensorData();
    }
  }, [pathData]);

  return sensorData;
};
export const getUserStoreData = async ({pathData}) => {
      try {
        const querySnapshot = await getDocs(
          collection(db, pathData),
        );
        const data =querySnapshot.docs.map(doc => ({
          ...doc.data(),
        }))
        return data
      } catch (error) {
        console.error('Error fetching sensor data: ', error);
        return []
      }
};
import React, {useEffect, useState} from 'react';
import {ref, onValue} from 'firebase/database';
import {FIREBASE_DATABASE} from '../FirbaseConfig';
const database = FIREBASE_DATABASE;

export const getRealTimeData = ({pathData}) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const dbRef = ref(database, pathData);
    const unsubscribe = onValue(dbRef, snapshot => {
      if (snapshot.exists()) {
        const value = snapshot.val();
        const processedData = [];
        for (let attr in value) {
          for (let key in value[attr]) {
            if (Array.isArray(value[attr][key].data)) {
              value[attr][key].data.forEach(item => {
                const processedItem = item;
                processedData.push(processedItem);
              });
            }
          }
        }
        setData(processedData);
      } else {
        console.log('No data available');
        setData();
      }
    });

    return () => unsubscribe();
  }, [pathData]);
  return data;
};

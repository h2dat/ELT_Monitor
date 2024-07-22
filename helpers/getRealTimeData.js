import React, {useEffect, useState} from 'react'
import {ref, onValue} from 'firebase/database';
import {FIREBASE_DATABASE} from '../FirbaseConfig';
const database = FIREBASE_DATABASE;

export const getRealTimeData =({uid}) => {
    const [data, setData] = useState({
        voltage: null,
        current: null,
        power: null,
        energy: null,
        frequency: null,
        pf: null,
      });
      useEffect(() => {
        const dbRef = ref(database, `/sensor_data/${uid}/data/`);
    
        const unsubscribe = onValue(dbRef, snapshot => {
          if (snapshot.exists()) {
            const value = snapshot.val();
            setData({
              voltage: value.voltage,
              current: value.current,
              power: value.power,
              energy: value.energy,
              frequency: value.frequency,
              pf: value.pf,
            });
          } else {
            console.log('No data available');
          }
        });
    
        return () => unsubscribe();
      }, [uid]);
    return data
}

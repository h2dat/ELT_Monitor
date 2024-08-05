import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {doc, setDoc, updateDoc, getDoc, getFirestore} from 'firebase/firestore';
import {ref, onValue, getDatabase} from 'firebase/database';
import {FIREBASE_APP} from '../FirbaseConfig';
import {getUserStoreData} from '../helpers/getStoreData';

const db = getFirestore(FIREBASE_APP);
const dbRealTime = getDatabase(FIREBASE_APP);

const HomeScreen = ({uid}) => {
  const pathData = `/sensor_data/${uid}/data/`;
  const pathUsage = `/user_data/${uid}/usage/`;

  const [dataRealTime, setDataRealTime] = useState();
  const [energyUsage, setEnergyUsage] = useState({
    used: 0,
    available: 0,
  });
  const [availableInput, setAvailableInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const calculateCost = kWh => {
    let cost = 0;
    if (kWh <= 50) {
      cost = kWh * 1678;
    } else if (kWh <= 100) {
      cost = 50 * 1678 + (kWh - 50) * 1734;
    } else if (kWh <= 200) {
      cost = 50 * 1678 + 50 * 1734 + (kWh - 100) * 2014;
    } else if (kWh <= 300) {
      cost = 50 * 1678 + 50 * 1734 + 100 * 2014 + (kWh - 200) * 2536;
    } else if (kWh <= 400) {
      cost =
        50 * 1678 + 50 * 1734 + 100 * 2014 + 100 * 2536 + (kWh - 300) * 2834;
    } else {
      cost =
        50 * 1678 +
        50 * 1734 +
        100 * 2014 +
        100 * 2536 +
        100 * 2834 +
        (kWh - 400) * 2927;
    }
    return cost;
  };
  const convertCostToKWh = cost => {
    let kWh = 0;
    const rates = [
      {limit: 50, rate: 1678},
      {limit: 100, rate: 1734},
      {limit: 200, rate: 2014},
      {limit: 300, rate: 2536},
      {limit: 400, rate: 2834},
      {limit: Infinity, rate: 2927},
    ];

    for (let i = 0; i < rates.length; i++) {
      const {limit, rate} = rates[i];
      const nextLimit = i === rates.length - 1 ? Infinity : rates[i + 1].limit;
      const currentLimit = nextLimit - limit;

      const currentCost = currentLimit * rate;
      if (cost <= currentCost) {
        kWh += cost / rate;
        break;
      } else {
        kWh += currentLimit;
        cost -= currentCost;
      }
    }

    return kWh;
  };

  useEffect(() => {
    const dbRef = ref(dbRealTime, pathData);

    const unsubscribe = onValue(
      dbRef,
      snapshot => {
        if (snapshot.exists()) {
          setDataRealTime(snapshot.val());
        } else {
          console.log('No data available');
          setDataRealTime(undefined);
        }
      },
      error => {
        console.log(error);
      },
    );

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    const fetchData = async () => {
      const usageData = await getUserStoreData({pathData: pathUsage});

      if (usageData?.length > 0 && dataRealTime) {
        const costEnergyUsed = calculateCost(dataRealTime?.energy);
        const costAvailable = calculateCost(usageData[0].usage);
        setEnergyUsage({
          used: costEnergyUsed || 0,
          available: costAvailable || 0,
        });
      }
    };

    fetchData();
  }, [dataRealTime, pathUsage]);

  const data = [
    {
      name: 'Used',
      population: energyUsage.used,
      color: '#0080ff',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Available',
      population: energyUsage.available,
      color: '#00FFFF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 1,
    useShadowColorFromDataset: false,
  };

  const handleUsageChange = async () => {
    const newAvailable = convertCostToKWh(parseFloat(availableInput));
    if (isNaN(newAvailable) || newAvailable < 0) {
      Alert.alert(
        'Invalid input',
        'Please enter a valid positive number for available energy.',
      );
      return;
    }

    const docRef = doc(db, pathUsage + 'usageData');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {usage: newAvailable});
      console.log('Document updated with ID: ', docRef.id);
    } else {
      await setDoc(docRef, {usage: newAvailable});
      console.log('Document written with ID: ', docRef.id);
    }

    setEnergyUsage({...energyUsage, available: newAvailable});
    setModalVisible(false);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      {dataRealTime ? (
        <>
          <Text style={styles.title}>This Month Usage</Text>

          <PieChart
            data={data}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[screenWidth / 4, 110]}
            hasLegend={false}
            hideLegend={true}
            absolute={false}
            style={{marginRight: 40}}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: '#0080ff'}]}
              />
              <Text>Used: {energyUsage.used.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: '#00FFFF'}]}
              />
              <Text>Threshold: {energyUsage.available.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Change Usage</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.warningText}>
          Invalid input', 'Please enter a valid positive number for available
          energy.
        </Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Available Energy</Text>
            <TextInput
              style={styles.input}
              placeholder="Available energy"
              value={availableInput}
              onChangeText={setAvailableInput}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={handleUsageChange}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  warningText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
    marginTop: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#0080ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonClose: {
    backgroundColor: '#0080ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
});

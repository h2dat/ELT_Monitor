import React, {useEffect, useState} from 'react';
import {getRealTimeData} from '../helpers/getRealTimeData';
import {getUserStoreData} from '../helpers/getStoreData';
import {getFirestore} from 'firebase/firestore';
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
import {doc, setDoc, updateDoc, getDoc} from 'firebase/firestore';
import FIREBASE_APP from '../FirbaseConfig';

const db = getFirestore(FIREBASE_APP);
const HomeScreen = ({uid}) => {
  const pathData = `/sensor_data/${uid}/data/`;
  const pathUsage = `/user_data/${uid}/usage/`;
  const dataRealTime = getRealTimeData({pathData});
  if (dataRealTime == null) {
    Alert.alert("Please config device before start! If you have any trouble contact support")
    return
  }
  const usageData = getUserStoreData({pathData: pathUsage});
  const [energyUsage, setEnergyUsage] = useState({
    used: 0,
    available: 0,
  });
  const [availableInput, setAvailableInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (usageData?.length > 0) {
      setEnergyUsage({
        used: dataRealTime.energy,
        available: usageData[0].usage,
      });
    } else {
      setEnergyUsage({used: dataRealTime.energy, available: 0});
    }
  }, [dataRealTime, usageData]);

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
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const handleUsageChange = () => {
    const newAvailable = parseFloat(availableInput);

    if (isNaN(newAvailable) || newAvailable < 0) {
      Alert.alert(
        'Invalid input',
        'Please enter a valid positive number for available energy.',
      );
      return;
    }
    const docRef = doc(db, pathUsage + 'usageData');
    const docSnap = getDoc(docRef);

    if (docSnap.exists) {
      updateDoc(docRef, {usage: newAvailable});
      console.log('Document updated with ID: ', docRef.id);
    } else {
      setDoc(docRef, {usage: newAvailable});
      console.log('Document written with ID: ', docRef.id);
    }
    setEnergyUsage({...energyUsage, available: newAvailable});

    setModalVisible(false);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
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
        absolute
        style={{marginRight: 40}}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#0080ff'}]} />
          <Text>Used: {energyUsage.used}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#00FFFF'}]} />
          <Text>Available: {energyUsage.available}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Change Usage</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
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

import React, {useState, useEffect} from 'react';
import {getDatabase, ref, onValue, update} from 'firebase/database';
import {FIREBASE_APP, FIREBASE_AUTH} from '../FirbaseConfig';
import {onAuthStateChanged} from 'firebase/auth';

import {getRealTimeData} from '../helpers/getRealTimeData';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  Modal,
  TextInput,
} from 'react-native';

const db = getDatabase(FIREBASE_APP);

const EditSystemScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, user => {
      setUser(user);
    });
  }, []);
  const [deviceName, setDeviceName] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pathData = `/sensor/${user?.uid}/data/`;
  const [systems, setSystems] = useState([]);
  useEffect(() => {
    console.log(pathData);
    const dbRef = ref(db, pathData);
    const unsubscribe = onValue(
      dbRef,
      snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.length > 0) {
            const updatedSystems = [];

            for (let i = 0; i < data.length; i++) {
              const [enabledStr, name] = data[i].split('_');
              const enabled = enabledStr === '1';

              updatedSystems.push({
                id: i,
                enabled,
                name:
                  name !== 'null' ? name : systems[i]?.name || `System ${i}`,
              });
            }

            setSystems(updatedSystems);
          }
        } else {
          console.log('No data available');
        }
      },
      error => {
        console.error(error);
      },
    );

    return () => unsubscribe();
  }, [user]);
  const handleEdit = id => {
    setSelectedId(id);
    setModalVisible(true);
  };
  const handleSubmit = () => {
    try {
      const docRef = ref(db, pathData);
      const element = systems.find(system => system.id === selectedId);

      const enabledValue = 0 ? element.enabled === 'fasle' : 1;
      const updateDeviceValue = {
        [selectedId - 1]: `${enabledValue}_${deviceName}`,
      };
      update(docRef, updateDeviceValue);
      setSystems(
        systems.map(item =>
          item.id === selectedId ? {...item, name: deviceName} : item,
        ),
      );
      console.log('Update device name succuess!');
    } catch (error) {
      console.log('Error when update value:', error);
    } finally {
      setModalVisible(false);
    }
  };
  const toggleSwitch = id => {
    const docRef = ref(db, pathData);
    const element = systems.find(system => system.id === id);

    const enabledValue = 0 ? element.enabled === 'fasle' : 1;
    const updateDeviceValue = {
      [id - 1]: `${enabledValue}_${deviceName}`,
    };
    update(docRef, updateDeviceValue);
    setSystems(
      systems.map(item =>
        item.id === selectedId ? {...item, name: deviceName} : item,
      ),
    );
    console.log('Update device name succuess!');
    setSystems(
      systems.map(item =>
        item.id === id ? {...item, enabled: !item.enabled} : item,
      ),
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => handleEdit(item.id)}
          style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <Switch
          onValueChange={() => toggleSwitch(item.id)}
          value={item.enabled}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit System</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter name of device</Text>
            <TextInput
              style={styles.input}
              placeholder="Name of device"
              onChangeText={text => setDeviceName(text)}
            />
            <TouchableOpacity style={styles.buttonClose} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={systems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  name: {
    fontSize: 18,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
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
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  buttonClose: {
    backgroundColor: '#0080ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
});

export default EditSystemScreen;

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './NavBar';

const Settings = () => {
  const navigation = useNavigation()
  const [electricalWarning, setElectricalWarning] = useState(false);
  const [thresholdWarning, setThresholdWarning] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Devices Manager")}>
          <Text style={styles.optionText}>Manage devices</Text>
          <Text style={styles.icon}>➔</Text>
        </TouchableOpacity>

        <View style={styles.option}>
          <Text style={styles.optionText}>Electrical Warning</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={electricalWarning ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={setElectricalWarning}
            value={electricalWarning}
          />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Threshold Warning</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={thresholdWarning ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={setThresholdWarning}
            value={thresholdWarning}
          />
        </View>
      </View>
      <Navbar style={styles.navbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  body: {
    flex: 1,
    justifyContent: 'center', 
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#6c8590',
  },
  optionText: {
    fontSize: 16,
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, 
  },
});

export default Settings;

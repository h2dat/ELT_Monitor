import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const SettingsScreen = () => {
  const [electricalWarning, setElectricalWarning] = useState(false);
  const [thresholdWarning, setThresholdWarning] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="lightning-bolt" size={24} color="white" />
          <Text style={styles.headerTitle}>Electricity</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="home" size={24} color="white" />
          <Text style={styles.headerTitle}>Home</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="account" size={24} color="white" />
          <Text style={styles.headerTitle}>User</Text>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Add System</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Edit System</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Edit Threshold</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.option}>
          <Text style={styles.optionText}>Electrical Warning</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={electricalWarning? '#f5dd4b' : '#f4f3f4'}
            onValueChange={setElectricalWarning}
            value={electricalWarning}
          />
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>Threshold Warning</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={thresholdWarning? '#f5dd4b' : '#f4f3f4'}
            onValueChange={setThresholdWarning}
            value={thresholdWarning}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a6572',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  headerIcon: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  content: {
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
    color: 'white',
    fontSize: 16,
  },
});

export default SettingsScreen;
import React, { useEffect, useState } from 'react';
import { getRealTimeData } from '../helpers/getRealTimeData';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const HomeScreen = ({ uid }) => {
  const dataRealTime = getRealTimeData({ uid });
  const [energyUsage, setEnergyUsage] = useState({
    used: 0,
    available: 0,
  });

  useEffect(() => {
    setEnergyUsage({ used: dataRealTime.energy, available: 0 });
  }, [dataRealTime]);

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
    // Logic to update energy usage based on user interaction
    // (e.g., using a slider or input field)
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
          <View style={[styles.legendColor, { backgroundColor: '#0080ff' }]} />
          <Text>Used: {energyUsage.used}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#00FFFF' }]} />
          <Text>Available: {energyUsage.available}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUsageChange}>
        <Text style={styles.buttonText}>Change Usage</Text>
      </TouchableOpacity>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Real-time Electricity Status</Text>
        <View style={styles.statusContent}>
          <Text>Voltage: {dataRealTime.voltage} V</Text>
          <Text>Current: {dataRealTime.current} A</Text>
          <Text>Power: {dataRealTime.power} W</Text>
          <Text>Frequency: {dataRealTime.frequency} Hz</Text>
          <Text>Power Factor: {dataRealTime.pf} pf</Text>
        </View>
      </View>
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
  statusContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContent: {
    alignItems: 'flex-start',
  },
});

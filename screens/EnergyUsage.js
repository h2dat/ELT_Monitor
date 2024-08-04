import React, {useEffect, useState} from 'react';
import {getRealTimeData} from '../helpers/getRealTimeData';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {PieChart} from 'react-native-chart-kit';

const EnergyUsage = ({uid}) => {
  const pathData = `/sensor_data/${uid}/data/`
  const dataRealTime = getRealTimeData({pathData});
  const [energyUsage, setEnergyUsage] = useState({
    used: 0,
    available: 0,
  });
  useEffect(() => {
    setEnergyUsage({used: dataRealTime.energy, available: 0});
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Month Usage</Text>

      <PieChart
        data={data}
        width={300}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[100, 110]}
        absolute
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#0080ff'}]} />
          <Text style={styles.legendText}>Used: {energyUsage.used}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: '#00FFFF'}]} />
          <Text style={styles.legendText}>
            Available: {energyUsage.available}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleUsageChange} style={styles.button}>
        <Text style={styles.buttonText}>Change Usage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#228B22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  usageBar: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  usageBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default EnergyUsage;

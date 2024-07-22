import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Pie from './DonutChart'; // Assuming Pie component is in the same directory

const PowerFactor = ({ powerFactor }) => {
  const data = [
    { number: powerFactor, color: '#007aff' }, // Blue for power factor value
    { number: 1 - powerFactor, color: '#dbdbdb' } // Gray for remaining
  ];

  const [value, setValue] = useState({
    index: -1,
    text: `${(powerFactor * 100).toFixed(2)}%`
  });

  const onItemSelected = index => () => {
    if (index === -1) {
      setValue({ index: -1, text: `${(powerFactor * 100).toFixed(2)}%` });
    } else {
      setValue({
        index,
        text: index === 0 ? `${(powerFactor * 100).toFixed(2)}%` : `${((1 - powerFactor) * 100).toFixed(2)}%`
      });
    }
  };

  return (
    <View style={styles.container}>
      <Pie
        value={value}
        data={data}
        size={200}
        pieSize={200}
        onItemSelected={onItemSelected}
      />
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>
          {(powerFactor * 100).toFixed(2)}%
        </Text>
        <Text style={styles.labelText}>Power Factor</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    transform: [{ translateY: 0 }],
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007aff',
  },
  labelText: {
    fontSize: 14,
  },
});

export default PowerFactor;

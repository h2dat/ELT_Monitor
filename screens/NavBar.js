import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Navbar = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Settings")}>
        <Text style={styles.icon}>⚡️</Text>
        <Text style={styles.text}>Electricity</Text>
      </TouchableOpacity>
      <View style={styles.navItem}>
        <Text style={styles.icon}>🏠</Text>
        <Text style={styles.text}>Home</Text>
      </View>
      <View style={styles.navItem}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.text}>User</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Navbar;
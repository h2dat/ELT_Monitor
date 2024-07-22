import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirbaseConfig';
import HomeScreen from './HomeScreen';
import Navbar from './NavBar';

const MainScreen = ({navigation}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {user && (
          <>
            <HomeScreen uid={user.uid} />
          </>
        )}
      </View>
      <Navbar navigation={navigation}/>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
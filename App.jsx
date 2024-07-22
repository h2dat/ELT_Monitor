import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import MainScreen from './screens/MainScreen';
import SettingsScreen from './screens/SettingsScreen'; // Ensure this path is correct
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirbaseConfig';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, user => {
      setUser(user);
    });
  }, []);

  function InsideLayout() {
    return (
      <InsideStack.Navigator>
        <InsideStack.Screen
          name="Main Screen"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <InsideStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </InsideStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

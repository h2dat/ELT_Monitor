import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import {FIREBASE_AUTH} from '../FirbaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password,
      );
      if (response.user) {
        sendEmailVerification(response.user);
        Alert.alert('Check your mail');
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password,
      );
    } catch (error) {
      Alert.alert('Sign in failed: ' + error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={[styles.input, (color = 'black')]}
          placeholder="Email"
          autoCapitalize="None"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="None"
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
        />
      </KeyboardAvoidingView>
      {loading ? (
        <ActivityIndicator size="large" color="#000ff" />
      ) : (
        <View style={{marginHorizontal: 5}}>
          <Button title="Login" onPress={() => signIn()} />
          <View style={{margin: 5}} />
          <Button title="Crerate account" onPrerss={() => signUp()} />
          <View style={{margin: 5}}/>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'black',
  },
  input: {
    marginHorizontal: 5,
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
});
export default Login;

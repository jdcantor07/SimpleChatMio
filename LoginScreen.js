// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  // Estados para guardar el email y la contraseña que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función que se ejecuta al presionar el botón "Ingresar"
  const handleLogin = async () => {
    // Verificamos que los campos no estén vacíos
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      // Usamos la función de Firebase para iniciar sesión
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      
      // Si el login es exitoso, Firebase nos devuelve la información del usuario
      console.log('¡Inicio de sesión exitoso!', userCredential.user.email);
      
      // Aquí puedes navegar a la pantalla principal de tu app
      Alert.alert('¡Bienvenido!', `Has iniciado sesión como ${userCredential.user.email}`);

    } catch (error) {
      // Si hay un error, lo mostramos en una alerta
      console.error(error);
      let errorMessage = 'Ocurrió un error al iniciar sesión.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'El correo o la contraseña son incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      }
      Alert.alert('Error de Autenticación', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail} // Actualiza el estado 'email' al escribir
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword} // Actualiza el estado 'password' al escribir
        secureTextEntry // Oculta los caracteres de la contraseña
      />
      <Button
        title="Ingresar"
        onPress={handleLogin} // Llama a la función handleLogin al presionar
      />
    </View>
  );
};

// Estilos básicos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    backgroundColor: 'white',
  },
});

export default LoginScreen;
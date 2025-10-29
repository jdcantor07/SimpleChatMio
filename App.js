// App.js
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import LoginScreen from './LoginScreen';
import ChatScreen from './ChatScreen';
import './firebase-config'; // Asegúrate de que Firebase se inicialice

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Escucha los cambios en el estado de autenticación (login/logout)
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Se desuscribe al salir
  }, []);

  // Muestra una pantalla de carga mientras se verifica el usuario
  if (initializing) return null;

  // Si no hay usuario, muestra la pantalla de Login
  if (!user) {
    return <LoginScreen />;
  }

  // Si hay un usuario, muestra la pantalla del Chat
  return <ChatScreen />;
}
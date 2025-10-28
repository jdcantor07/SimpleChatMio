// firebase-config.js
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

// Tu configuración de Firebase, adaptada para @react-native-firebase
const firebaseConfig = {
  apiKey: "AIzaSyApgse7lqDgxNOSUpGiigGz98YJFbRPsAg",
  authDomain: "simplechat-7b03d.firebaseapp.com",
  // La URL de la base de datos se construye con el ID del proyecto
  databaseURL: "https://simplechat-7b03d-default-rtdb.firebaseio.com", 
  projectId: "simplechat-7b03d",
  storageBucket: "simplechat-7b03d.appspot.com",
  messagingSenderId: "399561387099",
  appId: "1:399561387099:web:31c15b644fd67cef51a37e"
};

// Inicializa Firebase solo si no se ha hecho antes
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exporta la instancia de la base de datos para usarla en tu chat
export const database = firebase.database();
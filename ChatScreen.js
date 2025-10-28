// ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { database } from './firebase-config'; // Importa la configuración de la base de datos

const ChatScreen = () => {
  // Estado para el nombre de usuario (simulando que no hay login)
  const [user, setUser] = useState('');
  const [isUserSet, setIsUserSet] = useState(false);
  
  // Estado para los mensajes y el nuevo mensaje
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  // useEffect para cargar los mensajes de Firebase en tiempo real
  useEffect(() => {
    const messagesRef = database.ref('/messages').orderByChild('timestamp');
    
    const onMessagesUpdate = messagesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data ? Object.values(data) : [];
      setMessages(loadedMessages);
    });

    // Limpia el listener cuando el componente se desmonta
    return () => messagesRef.off('value', onMessagesUpdate);
  }, []);

  // Función para enviar un nuevo mensaje
  const handleSend = () => {
    if (newMessage.trim() === '' || user.trim() === '') {
      // Evita enviar mensajes vacíos o sin un nombre de usuario
      return;
    }

    const messageData = {
      user: user,
      text: newMessage,
      timestamp: new Date().getTime(),
    };
    
    // Guarda el nuevo mensaje en la base de datos de Firebase
    database.ref('/messages').push(messageData);
    setNewMessage(''); // Limpia el campo de texto
  };

  // Función para configurar el nombre de usuario
  const handleSetUser = () => {
    if (user.trim() !== '') {
      setIsUserSet(true);
    }
  };
  
  // Si el usuario aún no ha ingresado su nombre, muestra esta pantalla
  if (!isUserSet) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Ingresa tu nombre para chatear</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="Tu nombre"
          value={user}
          onChangeText={setUser}
        />
        <Button title="Entrar al Chat" onPress={handleSetUser} />
      </View>
    );
  }

  // Renderiza la pantalla principal del chat
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.timestamp.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.user === user ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageUser}>{item.user}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escribe un mensaje..."
        />
        <Button title="Enviar" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

// Estilos del componente
  // Estilos para ChatScreen.js (pegar al final del archivo)
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageUser: {
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});

export default ChatScreen;
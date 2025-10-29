// ChatScreen.js - CORREGIDO
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { database } from './firebase-config';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    const messagesRef = database.ref('/messages').orderByChild('timestamp');
    
    const onMessagesUpdate = messagesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      // El código para procesar los mensajes ahora es un poco diferente
      const loadedMessages = [];
      if (data) {
        for (const key in data) {
          loadedMessages.push({
            id: key,
            ...data[key],
          });
        }
      }
      setMessages(loadedMessages);
    });

    return () => messagesRef.off('value', onMessagesUpdate);
  }, []);

  const handleSend = () => {
    const currentUser = auth().currentUser;

    if (newMessage.trim() === '' || !currentUser) {
      if (!currentUser) {
        Alert.alert("Error", "No se ha podido identificar al usuario.");
      }
      return;
    }

    // --- CAMBIO 1: Guardamos el email y el UID en lugar del displayName ---
    const messageData = {
      userEmail: currentUser.email, // Guardamos el correo del usuario
      uid: currentUser.uid,         // Guardamos el ID único para comparaciones seguras
      text: newMessage,
      timestamp: new Date().getTime(),
    };
    
    database.ref('/messages').push(messageData);
    setNewMessage('');
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id} // Usamos el ID de la base de datos como key
        renderItem={({ item }) => {
          // --- CAMBIO 2: Comparamos el UID del mensaje con el UID del usuario actual ---
          const isMyMessage = item.uid === auth().currentUser.uid;
          
          return (
            <View style={[
              styles.messageBubble, 
              isMyMessage ? styles.myMessage : styles.otherMessage
            ]}>
              {/* --- CAMBIO 3: Mostramos el userEmail en lugar de item.user --- */}
              <Text style={styles.messageUser}>{isMyMessage ? "Tú" : item.userEmail}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          );
        }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
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

// (Tus estilos van aquí, no cambian)
const styles = StyleSheet.create({
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
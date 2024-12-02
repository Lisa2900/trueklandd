import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Keyboard, Image } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRoute } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'; // Importar Image Picker
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importar Firebase Storage
import Icon from 'react-native-vector-icons/FontAwesome'; // Usar FontAwesome para los íconos

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null); // Para almacenar la imagen seleccionada
  const flatListRef = useRef(null);
  const route = useRoute();
  const { chatId } = route.params;
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // Escuchar los mensajes en tiempo real
  useEffect(() => {
    const messagesRef = collection(getFirestore(), `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedMessages = [];
      querySnapshot.forEach((doc) => {
        loadedMessages.push(doc.data());
      });
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Función para enviar un mensaje de texto
  const sendMessage = async () => {
    if (!message.trim() && !image) return; // No enviar mensaje vacío ni imagen vacía

    try {
      const newMessageRef = collection(getFirestore(), `chats/${chatId}/messages`);

      let messageData = {
        senderId: userId,
        timestamp: serverTimestamp(),
      };

      if (message.trim()) {
        messageData.text = message;
      }

      if (image) {
        const storage = getStorage();
        const imageRef = ref(storage, `chat-images/${chatId}/${new Date().toISOString()}`);
        const response = await fetch(image.uri);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);

        const imageUrl = await getDownloadURL(imageRef);
        messageData.imageUrl = imageUrl; // Guardar la URL de la imagen en el mensaje
      }

      await addDoc(newMessageRef, messageData);
      setMessage(''); // Limpiar el campo de texto
      setImage(null); // Limpiar la imagen seleccionada
      Keyboard.dismiss(); // Ocultar el teclado
    } catch (err) {
      Alert.alert('Error', 'Hubo un error al enviar el mensaje: ' + err.message);
    }
  };

  // Función para seleccionar una imagen de la galería
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log('Usuario canceló la selección de imagen');
      } else if (response.errorMessage) {
        console.log('Error al seleccionar la imagen: ', response.errorMessage);
      } else {
        setImage(response.assets[0]); // Guardar la imagen seleccionada
      }
    });
  };

  // Función para tomar una foto con la cámara
  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) {
        console.log('Usuario canceló la toma de foto');
      } else if (response.errorMessage) {
        console.log('Error al tomar la foto: ', response.errorMessage);
      } else {
        setImage(response.assets[0]); // Guardar la foto tomada
      }
    });
  };

  // Mostrar los mensajes en tiempo real con FlatList
  const renderItem = ({ item }) => (
    <View
      style={{
        padding: 10,
        marginVertical: 5,
        backgroundColor: item.senderId === userId ? '#3498db' : '#ecf0f1',
        borderRadius: 15,
        alignSelf: item.senderId === userId ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
      }}
    >
      <Text style={{ fontWeight: 'bold', color: item.senderId === userId ? '#fff' : '#2c3e50' }}>
        {item.senderId === userId ? 'Tú' : 'Otro'}
      </Text>
      {item.text && <Text style={{ color: item.senderId === userId ? '#fff' : '#34495e' }}>{item.text}</Text>}
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={{ width: 200, height: 200, marginTop: 5 }} />}
    </View>
  );

  // Asegurar que el FlatList se desplace hacia el final cuando cambian los mensajes
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#ecf6fd' }}>
      {/* Mostrar los mensajes con FlatList */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }} // Espacio adicional para asegurar que el último mensaje no quede oculto
      />

      {/* Campo para escribir un mensaje */}
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Escribe un mensaje..."
        style={{
          borderWidth: 1,
          borderColor: '#3498db',
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 30,
          marginVertical: 10,
          backgroundColor: '#fff',
        }}
      />

      {/* Botones para tomar foto o elegir imagen */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={takePhoto} style={{ backgroundColor: 'transparent', padding: 10 }}>
          <Icon name="camera" size={24} color="#3498db" />
        </TouchableOpacity>

        <TouchableOpacity onPress={selectImage} style={{ backgroundColor: 'transparent', padding: 10 }}>
          <Icon name="image" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      {/* Mostrar la imagen seleccionada */}
      {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, marginBottom: 10 }} />}

      {/* Botón para enviar el mensaje */}
      <TouchableOpacity
        onPress={sendMessage}
        style={{
          backgroundColor: '#3498db',
          paddingVertical: 15,
          paddingHorizontal: 40,
          borderRadius: 30,
          alignSelf: 'flex-end',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreen;

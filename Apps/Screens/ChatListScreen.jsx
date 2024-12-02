import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getFirestore, collection, query, onSnapshot, where, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ChatListScreen = () => {
  const [chats, setChats] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      const firestore = getFirestore();
      const chatsRef = collection(firestore, 'chats');
      const q = query(chatsRef, where('users', 'array-contains', user.email));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const loadedChats = [];
        querySnapshot.forEach((doc) => {
          loadedChats.push({ id: doc.id, ...doc.data() });
        });
        setChats(loadedChats);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleChatPress = (chatId) => {
    if (chatId) {
      navigation.navigate('ChatScreen', { chatId: chatId });
    } else {
      console.log('Error: chatId no disponible');
    }
  };

  const handleLongPress = (chatId) => {
    setChatToDelete(chatId);
    setModalVisible(true); // Mostrar modal de confirmación
  };

  const handleDeleteChat = async () => {
    if (chatToDelete) {
      try {
        const firestore = getFirestore();
        const chatRef = doc(firestore, 'chats', chatToDelete);
        await deleteDoc(chatRef);
        setModalVisible(false);  // Cerrar modal
        setChatToDelete(null);  // Limpiar la referencia del chat a eliminar
      } catch (error) {
        console.error('Error al eliminar el chat:', error);
        Alert.alert('Error', 'Hubo un problema al eliminar el chat');
      }
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleChatPress(item.id)}
      onLongPress={() => handleLongPress(item.id)} // Mostrar opciones de eliminar al hacer largo toque
      style={{
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3498db' }}>
          {item.users.filter(userEmail => userEmail !== user.email)[0]}
        </Text>
        <Text style={{ color: '#555' }}>{item.users.length} participantes</Text>
      </View>
     
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#ecf6fd' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#3498db' }}>Mis Chats</Text>

      {chats.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888' }}>No tienes chats disponibles</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
        />
      )}

      {/* Modal de confirmación para eliminar chat */}
      {modalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
              <View style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 10,
                width: '80%',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#e74c3c' }}>
                  ¿Estás seguro que quieres eliminar este chat?
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      backgroundColor: '#95a5a6',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeleteChat}
                    style={{
                      backgroundColor: '#e74c3c',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default ChatListScreen;

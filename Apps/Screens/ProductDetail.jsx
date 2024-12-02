import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { EvilIcons } from '@expo/vector-icons';
import UserImage from "./../../assets/User.png";
import { app } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function ProductDetail() {
  const { params } = useRoute();
  const { product } = params;
  const nav = useNavigation();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const user = auth.currentUser;


  const [status, setStatus] = useState({ Status: 'No disponible' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params && params.product) {
      fetchProductStatus(product.productId, product.userEmail);
    }
  }, [params]);

  const fetchProductStatus = async (productId, userEmail) => {
    try {
      if (!productId || !userEmail) {
        console.error('productId o userEmail no proporcionados');
        //        console.log(productId);
        //        console.log(userEmail);
        return;
      }

      const q = query(
        collection(db, 'Status'),
        where('IdProduct', '==', productId),
        where('IdUser', '==', userEmail)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const statusDoc = snapshot.docs[0].data();
        setStatus(statusDoc);
      } else {
        console.warn('No se encontraron documentos de estado para el producto.');
        setStatus({ Status: 'No disponible' });
      }
    } catch (error) {
      console.error('Error al obtener el estado del producto:', error);
    }
  };


  const reportProduct = async () => {
    try {
      await addDoc(collection(db, 'Report'), {
        UserEmailReport: user.email,
        UserEmailComunity: product.userEmail,
      });
      Alert.alert('Listo', 'Gracias por ayudarnos a hacer una comunidad más limpia y responsable, en breve tomaremos acciones en el asunto.');
    } catch (error) {
      console.error('Error al reportar el producto:', error);
    }
  };

  const handleReportPress = () => {
    Alert.alert(
      '¿Quieres denunciar este artículo como inapropiado?',
      '',
      [
        {
          text: 'Sí',
          onPress: reportProduct,
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ]
    );
  };

  const sendEmailMessage = () => {
    const subject = 'Sobre ' + product.title;
    const body = 'Hola ' + product.userName + '\n' + 'Estoy Interesado en este Articulo';
    Linking.openURL(`mailto:${product.userEmail}?subject=${subject}&body=${body}`);
  };
  const createChat = async () => {
    try {
      // Referencia a la colección 'chats'
      const chatsRef = collection(db, 'chats');

      // Consulta para verificar si el usuario actual está en un chat
      const q = query(
        chatsRef,
        where('users', 'array-contains', user.email) // Solo filtra por el correo del usuario actual
      );

      const querySnapshot = await getDocs(q);

      // Verifica si ya existe un chat con el otro usuario
      let existingChatId = null;
      querySnapshot.forEach(doc => {
        const chatData = doc.data();
        // Si el chat ya contiene el correo del otro usuario, lo usamos
        if (chatData.users.includes(product.userEmail)) {
          existingChatId = doc.id;
        }
      });

      // Si ya existe un chat entre los dos usuarios, redirige al chat existente
      if (existingChatId) {
        nav.navigate('ChatScreen', { chatId: existingChatId });
        return; // Salir de la función ya que el chat existe
      }

      // Si no existe un chat, creamos uno nuevo
      const newChatRef = collection(db, 'chats');
      const newChatDoc = await addDoc(newChatRef, {
        users: [user.email, product.userEmail], // Lista de correos electrónicos de los participantes
        createdAt: new Date(), // Fecha de creación
      });

      // Agregar un mensaje inicial al nuevo chat
      const message = `Hola ${product.userName}, estoy interesado en tu producto: ${product.title}`;
      const messagesRef = collection(db, `chats/${newChatDoc.id}/messages`);
      await addDoc(messagesRef, {
        text: message,
        senderId: user.email, // El correo del usuario que envía el mensaje
        timestamp: new Date(), // Fecha y hora del mensaje
      });

      // Redirigir a la pantalla de chat con el chatId recién creado
      nav.navigate('ChatScreen', { chatId: newChatDoc.id });
    } catch (error) {
      console.error('Error al crear el chat:', error);
      Alert.alert('Error', 'No se pudo crear el chat. Inténtalo nuevamente.');
    }
  };



  const sendWhatsAppMessage = () => {
    const message = 'Hola ' + product.userName + ', estoy interesado en este artículo: ' + product.title;
    const phoneNumber = `whatsapp://send?phone=${product.telefono}&text=${encodeURIComponent(message)}`;
    Linking.openURL(phoneNumber);
  };

  const deleteUserPost = () => {
    Alert.alert('¿Quieres borrar?', '¿Quieres borrar esta publicación?', [
      {
        text: 'Sí',
        onPress: deleteFromFirebase,
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  };

  const editUserPost = () => {
    nav.navigate('edit-product', { product });
  };

  const deleteFromFirebase = async () => {
    console.log('Intentando borrar...');
    try {
      const q = query(collection(db, 'UserPost'), where('title', '==', product.title));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.warn('No se encontraron documentos para borrar.');
        return;
      }

      const promises = snapshot.docs.map(doc => {
        console.log('Borrando documento:', doc.id);
        return deleteDoc(doc.ref);
      });

      await Promise.all(promises);
      console.log('Documentos borrados exitosamente.');
      nav.goBack();
    } catch (error) {
      console.error('Error al intentar borrar documentos:', error);
    }
  };

  const handlePress = () => {
    const image = product.userImage ? { uri: product.userImage } : UserImage;
    const name = product.userName || 'Anónimo';
    const email = product.userEmail;
    nav.navigate('UserProfileScreen', { image, name, email });
  };


  const handlePreviousImage = () => {
    setCurrentImageIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => Math.min(prevIndex + 1, (product.images || []).length - 1));
  };

  const renderImage = () => {
    const images = product.images || [product.image];
    const showArrows = images.length > 1;

    return (
      <View style={styles.imageContainer}>
        {showArrows && (
          <TouchableOpacity onPress={handlePreviousImage} style={styles.arrowButtonLeft}>
            <EvilIcons name="chevron-left" size={40} color="#333" />
          </TouchableOpacity>
        )}
        <Image source={{ uri: images[currentImageIndex] }} style={styles.image} />
        {showArrows && (
          <TouchableOpacity onPress={handleNextImage} style={styles.arrowButtonRight}>
            <EvilIcons name="chevron-right" size={40} color="#333" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleReportPress} style={styles.reportButton}>
          <Icon name="exclamation-triangle" size={20} color="#fff" style={styles.reportIcon} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
      <TouchableOpacity onPress={() => nav.goBack()} style={{ position: 'absolute', top: 40, left: 20, zIndex: 1 }}>
        <EvilIcons name="chevron-left" size={40} color="#333" />
      </TouchableOpacity>
      <View style={{ backgroundColor: '#fff', borderRadius: 20, margin: 20, overflow: 'hidden', elevation: 5 }}>
        {renderImage()}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333' }}>{product.title}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <Text style={{ backgroundColor: '#3498db', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, color: '#fff', fontSize: 18 }}>{product.category}</Text>
          </View>
          <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center', color: '#555' }}>Descripción: {product.desc}</Text>
          <Text style={{ backgroundColor: status.Color, fontSize: 18, marginBottom: 20, textAlign: 'center', color: '#000' }}>
            Estado: {status.Status || 'No disponible'}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#555' }}>
            Ubicación: {product.location || 'No proporcionada'}
          </Text>
        </View>
        <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#00a6fb', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
          <Image source={product.userImage ? { uri: product.userImage } : UserImage} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 15 }} />
          {user?.email === product.userEmail ? (
            <>
              <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>{product.userName || 'Usuario'}</Text>
              <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{product.userEmail}</Text>
            </>
          ) : (
            <TouchableOpacity onPress={handlePress}>
              <View>
                <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 5 }}>{product.userName || 'Anónimo'}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {user?.email === product.userEmail ? (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <TouchableOpacity onPress={deleteUserPost} style={styles.deleteButton}>
            <Icon name="trash" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={editUserPost} style={styles.editButton}>
            <Icon name="edit" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            onPress={createChat}
            style={{
              backgroundColor: '#3498db',
              paddingVertical: 15,
              paddingHorizontal: 40,
              borderRadius: 30,
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={require('./../../assets/chat-icon.png')} // Cambia con tu ícono
              style={{
                width: 24,
                height: 24,
                marginRight: 10, // Espacio entre el ícono y el texto
              }}
            />
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Iniciar Chat</Text>
          </TouchableOpacity>

          {/* Botón Enviar Correo
      <TouchableOpacity
        onPress={sendEmailMessage}
        style={{
          backgroundColor: 'black',
          paddingVertical: 15,
          paddingHorizontal: 40,
          borderRadius: 30,
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginRight: 10 }}>
          Enviar Correo
        </Text>
        <Image
          source={require('./../../assets/gmail.png')}
          style={{
            width: 34,
            height: 34,
            marginRight: 10,
          }}
        />
      </TouchableOpacity>
      */}


          {/* Botón Enviar WhatsApp */}
          <TouchableOpacity
            onPress={sendWhatsAppMessage}
            style={{
              backgroundColor: 'white',
              paddingVertical: 15,
              paddingHorizontal: 40,
              borderRadius: 30,
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: '#000',
                fontWeight: 'bold',
                fontSize: 18,
                marginRight: 10,
              }}
            >
              Enviar WhatsApp
            </Text>
            <Image
              source={require('./../../assets/whats.png')}
              style={{
                width: 34,
                height: 34,
                marginRight: 10,
              }}
            />
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  arrowButtonLeft: {
    position: 'absolute',
    top: '50%',
    left: 10,
    zIndex: 2,
  },
  arrowButtonRight: {
    position: 'absolute',
    top: '50%',
    right: 10,
    zIndex: 2,
  },
  reportButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderRadius: 40,
    marginTop: 15,
    alignSelf: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';

export default function EditPostScreen() {
  const { params } = useRoute();
  const { product } = params;
  const nav = useNavigation();
  const db = getFirestore(app);

  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [desc, setDesc] = useState('');
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState('');
  const [telefono, setTelefono] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (product) {
      console.log('Product recibido:', product);
      fetchProductDetails(product.productId, product.userEmail);
    }
  }, [product]);

  const fetchProductDetails = async (productId, userEmail) => {
    try {
      const q = query(
        collection(db, 'Status'),
        where('IdProduct', '==', productId),
        where('IdUser', '==', userEmail)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const statusDoc = snapshot.docs[0];
        const data = statusDoc.data();
        console.log('Datos obtenidos:', data);

        // Actualiza los estados con los valores obtenidos
        setStatus(data.Status || '');
        setCategory(product.category || '');
        setCreatedAt(product.createdAt || '');
        setDesc(product.desc || '');
        setImages(product.images || []);
        setLocation(product.location || '');
        setTelefono(product.telefono || '');
        setTitle(product.title || '');
      } else {
        console.warn('No se encontró el estado del producto.');
      }
    } catch (error) {
      console.error('Error al obtener los detalles del producto:', error);
    }
  };

  const getColorFromStatus = (status) => {
    switch (status) {
      case 'En Proceso':
        return '#00FF00'; // Verde
      case 'Satisfactorio':
        return '#FFFF00'; // Amarillo
      case 'Incompleto':
        return '#808080'; // Gris
      default:
        return '#FFFFFF'; // Blanco por defecto
    }
  };

  const handleSave = async () => {
    try {
      const q = query(
        collection(db, 'Status'),
        where('IdProduct', '==', product.productId),
        where('IdUser', '==', product.userEmail)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const statusDoc = snapshot.docs[0];
        const docRef = doc(db, 'Status', statusDoc.id);

        // Obtener el color basado en el estado seleccionado
        const color = getColorFromStatus(status);

        await updateDoc(docRef, { 
          Status: status,
          Color: color,
          category,
          createdAt,
          desc,
          images,
          location,
          telefono,
          title,
        });

        Alert.alert('Éxito', 'El estado y los detalles del producto han sido actualizados correctamente.');
        nav.goBack();
      } else {
        console.warn('No se encontró el documento para actualizar.');
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Actualiza el producto</Text>

      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Categoría"
      />
      <TextInput
        style={styles.input}
        value={createdAt}
        onChangeText={setCreatedAt}
        placeholder="Fecha de creación"
      />
      <TextInput
        style={styles.input}
        value={desc}
        onChangeText={setDesc}
        placeholder="Descripción"
      />
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ubicación"
      />
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Teléfono"
      />
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
      />

      <Picker
        selectedValue={status}
        style={styles.picker}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="En Proceso" value="En Proceso" />
        <Picker.Item label="Satisfactorio" value="Satisfactorio" />
        <Picker.Item label="Incompleto" value="Incompleto" />
      </Picker>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

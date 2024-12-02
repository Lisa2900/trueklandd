import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

export default function MyProducts() {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getUserPost(user.email);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const user = auth.currentUser;
      if (user) {
        getUserPost(user.email);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const getUserPost = async (userEmail) => {
    setLoading(true);
    setProductList([]); 
    try {
      const q = query(collection(db, 'UserPost'), where('userEmail', '==', userEmail));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => doc.data());
      setProductList(posts); 
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <View className='flex items-center justify-center p-2'>
        <Text className='text-[20px] text-gray-400'>Cargando...</Text>
      </View>
    );
  }

  return (
    <View className='p-2'>
      {productList.length > 0 ? (
        <LatestItemList latestItemList={productList} />
      ) : (
        <View className='flex items-center justify-center'>
          <Text className='p-5 text-[20px] text-gray-400 mt-24'>
            ¡Aún no has subido ningún producto!
          </Text>
          <Entypo name="emoji-sad" size={100} color="gray" />
        </View>
      )}
    </View>
  );
}

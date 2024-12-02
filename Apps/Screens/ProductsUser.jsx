import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import LatestItemList from '../Components/HomeScreen/LatestItemList';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons'; 

export default function ProductsUser(props) {
  const { email } = props.route.params;
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [productList, setProductList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getUserPost();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserPost();
    });
    return unsubscribe;
  }, [navigation]);

  const getUserPost = async () => {
    setProductList([]);
    try {
      const q = query(collection(db, 'UserPost'), where('userEmail', '==', email));
      const snapshot = await getDocs(q);
      const products = [];
      snapshot.forEach(doc => {
        products.push(doc.data());
      });
      setProductList(products);
    } catch (error) {
      console.error("Error fetching user products: ", error);
    }
  };

  return (
    <View className="flex-1 p-4">
      {productList.length === 0 ? (
        <View className='flex items-center justify-center flex-1'>
          <Text className='text-[20px] text-gray-400'>
            ¡Aún no se ha subido ningún producto!
          </Text>
          <Entypo name="emoji-sad" size={100} color="gray" />
        </View>
      ) : (
        <LatestItemList latestItemList={productList} />
      )}
    </View>
  );
}

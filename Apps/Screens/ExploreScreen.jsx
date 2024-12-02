import React, { useEffect, useState, useRef } from "react";
import { View, Text, StatusBar, RefreshControl, ScrollView, TextInput, Animated, FlatList } from "react-native";
import { collection, getDocs, getFirestore, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestItemList from "../Components/HomeScreen/LatestItemList";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function ExploreScreen() {
  const db = getFirestore(app);
  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Query para productos autorizados
    const q = query(
      collection(db, "UserPost"),
      where("isAuthorized", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = [];
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      console.log("Fetched products: ", products); // Verifica los productos
      setProductList(products);
    }, (error) => {
      console.error("Error fetching products: ", error);
    });

    return () => unsubscribe(); // Limpieza al desmontar el componente
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const q = query(
        collection(db, "UserPost"),
        where("isAuthorized", "==", true),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const products = [];
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      setProductList(products);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value === '') {
      // Volver a cargar todos los productos autorizados si la búsqueda está vacía
      const q = query(
        collection(db, "UserPost"),
        where("isAuthorized", "==", true),
        orderBy("createdAt", "desc")
      );
      getDocs(q).then((snapshot) => {
        const products = [];
        snapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });
        setProductList(products);
      });
    } else {
      const filteredProducts = productList.filter(product =>
        product.title.toLowerCase().includes(value.toLowerCase())
      );
      setProductList(filteredProducts);
    }
  };

  const headerTranslateY = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
     <FlatList
  data={productList}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <LatestItemList latestItemList={[item]} />}
  ListHeaderComponent={
    <View style={{
      padding: 1,
      backgroundColor: '#e3f2fd',
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#90caf9'
    }}>
      <AntDesign name="search1" size={24} color="gray" />
      <TextInput
        placeholder="Buscar"
        style={{
          marginLeft: 8,
          fontSize: 18,
          flex: 1
        }}
        onChangeText={handleSearch}
        value={searchQuery}
      />
    </View>
  }
  ListEmptyComponent={
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <Text style={{ fontSize: 20, color: '#888' }}>
        ¡Aún no se ha subido ningún producto!
      </Text>
      <Entypo name="emoji-sad" size={100} color="gray" />
    </View>
  }
  refreshing={refreshing}
  onRefresh={onRefresh}
  numColumns={2} // Muestra dos columnas
  columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }} // Espaciado entre columnas
/>

    </View>
  );
}

import React, { useEffect, useState, useRef, useCallback } from "react";
import { FlatList, RefreshControl, View, Text, Animated } from "react-native";
import Header from "../Components/HomeScreen/Header";
import Slider from "../Components/HomeScreen/Slider";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import Categories from "../Components/HomeScreen/Categories";
import LatestItemList1 from "../Components/HomeScreen/LatestItemList1";
import { Entypo } from '@expo/vector-icons';
import moment from "moment";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const headerAnimation = useRef(new Animated.Value(0)).current;

  const db = getFirestore(app);

  const loadSliders = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    const sliders = querySnapshot.docs.map(doc => doc.data());
    setSliderList(sliders);
  }, [db]);

  const loadCategories = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "Category"));
    const categories = querySnapshot.docs.map(doc => doc.data());
    setCategoryList(categories);
  }, [db]);

  const loadLatestItems = useCallback(async () => {
    try {
      // Cambiado para ordenar por 'createdAt' desde Firebase
      const postsQuery = query(
        collection(db, "UserPost"),
        where("isAuthorized", "==", true),
        orderBy("createdAt", "desc") // Ordenar por fecha más reciente directamente desde Firebase
      );
      const querySnapshot = await getDocs(postsQuery);
      const items = querySnapshot.docs.map(doc => {
        const itemData = doc.data();
        return { ...itemData, createdAtTimestamp: moment(itemData.createdAt).valueOf() };
      });
      setLatestItemList(items);
    } catch (error) {
      console.error("Error al obtener la lista de elementos más recientes:", error);
    }
  }, [db]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadSliders(), loadCategories(), loadLatestItems()]);
      setDataLoaded(true);
    };

    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (dataLoaded) {
        Animated.timing(headerAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setHeaderVisible(false));
      }
    }, 3000);

    loadData();

    return () => clearTimeout(timer);
  }, [dataLoaded, loadSliders, loadCategories, loadLatestItems, headerAnimation]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadSliders(), loadCategories(), loadLatestItems()]);
    } catch (error) {
      console.error("Error al refrescar los datos:", error);
    }
    setRefreshing(false);
  };

  const headerTranslateY = headerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <FlatList
      data={latestItemList}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <>
          {headerVisible && (
            <Animated.View style={{ transform: [{ translateY: headerTranslateY }] }}>
              <Header />
            </Animated.View>
          )}
          <Slider sliderList={sliderList} />
          <Categories categoryList={categoryList} />
        </>
      }
      ListEmptyComponent={
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
          <Text style={{ fontSize: 20, color: 'gray' }}>
            ¡Aún no se ha subido ningún artículo!
          </Text>
          <Entypo name="emoji-sad" size={100} color="gray" />
        </View>
      }
      renderItem={({ item }) => <LatestItemList1 latestItemList={[item]} heading={null} />}
    />
  );
}

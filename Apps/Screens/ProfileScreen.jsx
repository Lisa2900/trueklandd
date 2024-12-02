import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  Platform,
  Linking,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import diario from "./../../assets/images/diario.png";
import buscar from "./../../assets/images/buscar.png";
import mundo from "./../../assets/images/mundo.png";
import salir from "./../../assets/images/salir.png";
import { app } from "../../firebaseConfig";
import UserImage from "./../../assets/User.png";
export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const menuList = [
    { id: 1, name: "Mis Articulos", icon: diario, path: "my-product" },
    { id: 2, name: "Explorar", icon: buscar, path: "explorar" },
    {
      id: 3,
      name: "Siguenos",
      icon: mundo,
      path: "https://www.facebook.com/profile.php?id=61558481104661",
    },
    { id: 4, name: "Salir", icon: salir },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            setUser({
              fullName: currentUser.displayName || "Usuario",
              email: currentUser.email,
              imageUrl: currentUser.photoURL || UserImage,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchUser();
  }, []);

  const onMenuPress = (item) => {
    if (item.name === "Salir") {
      auth.signOut();
    } else if (item.path) {
      if (item.name === "Siguenos") {
        Linking.openURL(item.path);
      } else {
        navigation.navigate(item.path);
      }
    }
  };

  const handleButtonPressIn = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", padding: 20 }}>
          <View
            style={{
              borderRadius: 20,
              backgroundColor: "white",
              padding: 20,
              marginTop: 80,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                },
                android: {
                  elevation: 5,
                },
              }),
            }}
          >
            <TouchableOpacity
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              activeOpacity={1}
              style={{ alignItems: "center", marginTop: 50 }}
            >
              <Animated.Image
                source={UserImage} // Default image if user image is unavailable
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: "black",
                  transform: [{ scale: scaleAnimation }],
                }}
              />
            </TouchableOpacity>
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                {user?.fullName || "Usuario"}
              </Text>
              <Text style={{ fontSize: 18, color: "#888888", marginTop: 5 }}>
                {user?.email}
              </Text>
            </View>
          </View>
        </View>
      }
      data={menuList}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onMenuPress(item)}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          style={{
            flex: 1,
            alignItems: "center",
            margin: 5,
            borderRadius: 10,
            backgroundColor: "#F0F0F0",
            padding: 10,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              },
              android: {
                elevation: 5,
              },
            }),
          }}
        >
          <Animated.Image
            source={item.icon}
            style={{
              width: 70,
              height: 70,
              transform: [{ scale: scaleAnimation }],
            }}
          />
          <Text style={{ fontSize: 12, marginTop: 5, color: "#007BFF" }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

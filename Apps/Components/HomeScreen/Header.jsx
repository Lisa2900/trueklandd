import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions, ActivityIndicator } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import UserImage from "../../../assets/User.png";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("User Display Name:", user.displayName);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" color="#0096c7" />
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "#0096c7",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: screenWidth - 40,
        }}
      >
        <View style={{ marginRight: 20 }}>
          <Image
            source={user?.photoURL ? { uri: user.photoURL } : UserImage}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 3,
              borderColor: "#fff",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#4caf50",
              borderRadius: 10,
              padding: 3,
            }}
          >
            <AntDesign name="check" size={18} color="#fff" />
          </View>
        </View>
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            ¡Hola!
          </Text>
          {user?.displayName ? (
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
              {user.displayName}
            </Text>
          ) : (
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
              Usuario.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

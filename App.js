import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./Apps/Navigations/TabNavigation";
import LoginScreen from "./Apps/Screens/LoginScreen";
import { getAuth, onAuthStateChanged, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "./firebaseConfig";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Inicializa Firebase Auth con persistencia solo si no está inicializado
    const auth = getAuth(app) || initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {isSignedIn ? <TabNavigation /> : <LoginScreen />}
      </View>
    </NavigationContainer>
  );
}

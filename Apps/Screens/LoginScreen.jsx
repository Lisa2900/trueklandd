import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import SignInScreen from "../Autentification/SignInScreen";
import SignUpScreen from "../Autentification/SignUpScreen";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [showSignIn, setShowSignIn] = useState(true);

  // Maneja el éxito del inicio de sesión
  const handleSignInSuccess = () => {
    console.log("Inicio de sesión exitoso");
    setShowSignIn(true);  // Cambia el estado si fuera necesario
  };
  

  const handleSignUpSuccess = () => {
    setShowSignIn(true);
  };

  const toggleSignInSignUp = () => {
    setShowSignIn(!showSignIn);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("./../../assets/images/Cam.jpeg")}
          style={styles.headerImage}
          accessibilityLabel="Header image"
        />

        <View style={styles.mainContainer}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <View style={styles.taglineContainer}>
            <Text style={styles.taglineText}>
              ¡<Text style={styles.taglineColor1}>Intercambia</Text>,{" "}
              <Text style={styles.taglineColor2}>Conecta y</Text>,{" "}
              <Text style={styles.taglineColor3}>Descubre</Text>. Convierte lo
              que ya no necesitas en algo valioso para los demás.
            </Text>
          </View>
          {showSignIn ? (
            <SignInScreen onSignInSuccess={handleSignInSuccess} />
          ) : (
            <SignUpScreen onSignUpSuccess={handleSignUpSuccess} />
          )}
          <TouchableOpacity
            onPress={toggleSignInSignUp}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {showSignIn
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  mainContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
  },
  welcomeText: {
    marginTop: 20,
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "gray",
  },
  taglineContainer: {
    marginTop: 40,
  },
  taglineText: {
    fontSize: 18,
    marginTop: 7,
    textAlign: "center",
  },
  taglineColor1: {
    color: "#FE54C3",
  },
  taglineColor2: {
    color: "aqua",
  },
  taglineColor3: {
    color: "royalblue",
  },
  toggleButton: {
    marginTop: 20,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
});

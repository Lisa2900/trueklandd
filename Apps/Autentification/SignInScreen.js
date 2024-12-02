import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";

export default function SignInScreen({ onSignInSuccess }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onSignInPress = async () => {
    if (!emailAddress || !password) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }

    if (!validateEmail(emailAddress)) {
      setErrorMessage("Por favor, introduce un correo electrónico válido.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, emailAddress, password);
      const user = userCredential.user;
      
      if (user.emailVerified) {
        onSignInSuccess(); // Llama al callback si el inicio de sesión es exitoso
      } else {
        setErrorMessage("Por favor, verifica tu correo electrónico.");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        setErrorMessage("La contraseña es incorrecta.");
      } else if (err.code === "auth/user-not-found") {
        setErrorMessage("No hay ningún usuario registrado con este correo electrónico.");
      } else {
        setErrorMessage("Hubo un problema al intentar iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animatable.View animation="fadeIn" duration={1000} style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Correo electrónico"
          onChangeText={setEmailAddress}
          style={[styles.input, errorMessage && styles.errorInput]}
          accessibilityLabel="Correo electrónico"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            placeholder="Contraseña"
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            style={[styles.input, styles.passwordInput, errorMessage && styles.errorInput]}
            accessibilityLabel="Contraseña"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.togglePasswordButton}
            accessibilityLabel="Mostrar u ocultar contraseña"
          >
            <Icon name={passwordVisible ? "eye-slash" : "eye"} size={24} color="#007BFF" />
          </TouchableOpacity>
        </View>
        {errorMessage ? (
          <Animatable.Text animation="shake" style={styles.errorText}>
            {errorMessage}
          </Animatable.Text>
        ) : null}
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <TouchableOpacity onPress={onSignInPress} style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  togglePasswordButton: {
    paddingHorizontal: 10,
  },
  errorInput: {
    borderColor: "#FF0000",
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  errorText: {
    color: "#FF0000",
    marginBottom: 12,
    textAlign: "center",
  },
});

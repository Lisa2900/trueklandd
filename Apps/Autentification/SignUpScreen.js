import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Importar Firestore
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";

export default function SignUpScreen({ navigation }) {
  const auth = getAuth();
  const db = getFirestore(); // Firestore

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onSignUpPress = async () => {
    if (!fullName.trim()) {
      setErrorMessage("Por favor, introduce tu nombre completo.");
      return;
    }

    if (!validateEmail(emailAddress)) {
      setErrorMessage("Por favor, introduce un correo electrónico válido.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailAddress, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });
      await sendEmailVerification(user);
      setPendingVerification(true);

      // Crear un documento en Firestore con los datos del usuario
      const userRef = doc(db, "users", user.uid); // Crea una referencia al documento con el UID del usuario
      await setDoc(userRef, {
        createdAt: new Date().toISOString(), // Fecha de creación
        email: user.email, // Correo electrónico
        uid: user.uid, // UID del usuario
      });

      Alert.alert(
        "Verificación",
        "Se ha enviado un correo de verificación. Por favor, revisa tu correo electrónico."
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("El correo electrónico ya está en uso. Por favor, usa otro correo.");
      } else {
        console.error(error);
        setErrorMessage("Hubo un problema al intentar registrarse.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    const user = auth.currentUser;

    try {
      await user.reload();
      if (user.emailVerified) {
        Alert.alert("Éxito", "Registro exitoso, por favor inicia sesión.");
        // Aquí navegas a la pantalla de inicio de sesión después de la verificación exitosa
        navigation.navigate("LoginScreen");
      } else {
        setErrorMessage("El correo electrónico no ha sido verificado.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Hubo un problema al verificar el correo.");
    }
  };

  return (
    <Animatable.View animation="fadeIn" duration={1000} style={styles.container}>
      {!pendingVerification ? (
        <View style={styles.formContainer}>
          <TextInput
            value={fullName}
            placeholder="Nombre completo"
            onChangeText={setFullName}
            style={[styles.input, errorMessage && styles.errorInput]}
            accessibilityLabel="Nombre completo"
          />
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Correo electrónico"
            onChangeText={setEmailAddress}
            style={[styles.input, errorMessage && styles.errorInput]}
            accessibilityLabel="Correo electrónico"
          />
          <PasswordInput
            value={password}
            placeholder="Contraseña"
            isVisible={passwordVisible}
            onChangeText={setPassword}
            toggleVisibility={() => setPasswordVisible(!passwordVisible)}
          />
          <PasswordInput
            value={confirmPassword}
            placeholder="Confirmar Contraseña"
            isVisible={confirmPasswordVisible}
            onChangeText={setConfirmPassword}
            toggleVisibility={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          />
          {errorMessage ? (
            <Animatable.Text animation="shake" style={styles.errorText}>
              {errorMessage}
            </Animatable.Text>
          ) : null}
          {loading ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.infoText}>
            Por favor, verifica tu correo electrónico y luego presiona
            "Verificar Correo".
          </Text>
          <TouchableOpacity onPress={onPressVerify} style={styles.button}>
            <Text style={styles.buttonText}>Verificar Correo</Text>
          </TouchableOpacity>
          {errorMessage ? (
            <Animatable.Text animation="shake" style={styles.errorText}>
              {errorMessage}
            </Animatable.Text>
          ) : null}
        </View>
      )}
    </Animatable.View>
  );
}

const PasswordInput = ({ value, placeholder, isVisible, onChangeText, toggleVisibility }) => (
  <View style={styles.passwordContainer}>
    <TextInput
      value={value}
      placeholder={placeholder}
      secureTextEntry={!isVisible}
      onChangeText={onChangeText}
      style={[styles.input, styles.passwordInput]}
    />
    <TouchableOpacity
      onPress={toggleVisibility}
      style={styles.togglePasswordButton}
    >
      <Icon
        name={isVisible ? "eye-slash" : "eye"}
        size={24}
        color="#007BFF"
      />
    </TouchableOpacity>
  </View>
);

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
    borderColor: "#ccc",
    borderWidth: 0,
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
  infoText: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    marginBottom: 12,
  },
});

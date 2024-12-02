import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    width: width - 30, // Ajustar el ancho del card para mayor consistencia
    height: 280,  // Ajustar altura para mejorar la visibilidad
    margin: 10,
    padding: 15,
    borderRadius: 15,  // Bordes más redondeados para un diseño más moderno
    borderWidth: 1,
    borderColor: "#d1d1d1",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,  // Sombra más prominente
    overflow: 'hidden',  // Para asegurar que las imágenes redondeadas no se salgan del card
  },
  images: {
    width: "100%",
    height: "60%",  // Reducción de altura para dejar más espacio al texto
    borderRadius: 10,
    resizeMode: "cover",  // Mejor ajuste de la imagen
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,  // Espaciado entre imagen y contenido
  },
  title: {
    fontSize: 16,  // Aumentar tamaño para mayor legibilidad
    fontWeight: "bold",
    textAlign: "center",
    color: "#00b4d8",
    marginBottom: 8,
  },
  details: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  category: {
    fontSize: 12,
    color: "#007bff",
    backgroundColor: "#f0f8ff",  // Fondo claro para resaltar categoría
    marginTop: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 15,
    width: 80,
    textAlign: "center",
    borderWidth: 1,  // Bordes para darle mayor contraste
    borderColor: "#007bff",
  },
});

export default function PostItem({ item }) {
  const navigation = useNavigation();

  const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("product-detail", {
          product: item,
        })
      }
    >
      {firstImage && (
        <Image
          source={{ uri: firstImage }}
          style={styles.images}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.details} numberOfLines={2}>
          <Text style={styles.detailLabel}>Cambio:</Text> {item.cambio}
        </Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

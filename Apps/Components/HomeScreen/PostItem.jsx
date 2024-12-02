import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  card: {
    width: 165,
    height: 250,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  images: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    color: "#00b4d8",
  },
  details: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 3,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  category: {
    fontSize: 10,
    color: "#007bff",
    backgroundColor: "#fff",
    marginTop: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 10,
    width: 70,
    textAlign: "center",
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
        <Text style={styles.details} numberOfLines={3}>
          <Text style={styles.detailLabel}>Cambio:</Text> {item.cambio}
        </Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

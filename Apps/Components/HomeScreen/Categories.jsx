import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function Categories({ categoryList }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Categorías</Text>
      <FlatList
        data={categoryList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('item-list', { Category: item.name })}
            style={styles.categoryItem}>
            <Image source={{ uri: item.icon }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12, 
    backgroundColor: '#edf2fb',
    borderRadius: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80, 
    marginHorizontal: 8, 
    borderRadius: 12, 
    backgroundColor: '#fff',
    elevation: 4, 
    overflow: 'hidden',
  },
  categoryImage: {
    width: 50, 
    height: 50, 
    marginBottom: 6, 
  },
  categoryText: {
    fontSize: 12, 
    textAlign: 'center',
  },
});
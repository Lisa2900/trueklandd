import { View, Text, FlatList, Image } from "react-native";
import React from "react";

export default function Slider({ sliderList }) {
  return (
    <View className="mt-5">
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View>
            <Image
              source={{ uri: item.image }}
              style={{
                height: 100,
                width: 350,
                borderRadius: 10,
                resizeMode: "contain",
              }}
            />
          </View>
        )}
      />
    </View>
  );
}

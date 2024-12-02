import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import PostItem from "./PostItem1";

export default function LatestItemList1({ latestItemList, heading }) {
  return (
    <View className="mt-3">
      <Text className="font-bold text-[20px]">{heading}</Text>
      <FlatList
        data={latestItemList}
        numColumns={1}
        renderItem={({ item, index }) => (
          <PostItem item={item} />

        )}
        nestedScrollEnabled
      />
    </View>
  );
}

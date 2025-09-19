// src/components/ProductItem.js
import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";

export default function ProductItem({ item, itemWidth, onPress }) {
  // Lấy thumbnail nếu có, fallback về src
  const imageUrl = item.images[0]?.sizes?.thumbnail || item.images[0]?.src;

  return (
    <TouchableOpacity
      style={[styles.item, { width: itemWidth }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price} VND</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 13,
    fontWeight: "400",
    textTransform: "uppercase",
  },
  price: {
    fontSize: 13,
    color: "#ff5900",
    marginTop: 4,
  },
});

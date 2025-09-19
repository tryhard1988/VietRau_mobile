// components/ProductSearch.js
import React, { useState, useMemo } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ProductSearch({ products, onSelect }) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    return products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, products]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tìm sản phẩm..."
        value={query}
        onChangeText={setQuery}
      />
      {query.length > 0 && (
        <FlatList
          style={styles.suggestions}
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelect(item)}
              style={styles.item}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  input: { backgroundColor: '#fff', padding: 8, borderRadius: 8 },
  suggestions: { maxHeight: 200, backgroundColor: '#fff' },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
});

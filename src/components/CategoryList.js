// components/CategoryList.js
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { fetchCategoriesApi } from "../api/fetchCategoriesApi";

export default function CategoryList({ selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategoriesApi();
        const withProducts = data.filter((cat) => cat.count > 0);

        // ✅ Chỉ hiện các category được định nghĩa ở đây
        const groups = [
          { id: 1000, name: "Tất Cả", childrenIds: [] },
          { id: 1001, name: "Rau củ quả", childrenIds: [18, 19, 21, 897, 901, 899] },
          { id: 1002, name: "Trái Cây", childrenIds: [22, 907] },
          { id: 1003, name: "Bánh kẹo & đồ ngọt", childrenIds: [17, 891] },
          { id: 1004, name: "Đồ uống", childrenIds: [1478, 1471] },
          { id: 1005, name: "Thực phẩm chế biến", childrenIds: [229, 895] },
          { id: 1006, name: "Các Loại Bột", childrenIds: [1473, 1488] },
          { id: 1007, name: "Đồ Chơi - Trang Trí", childrenIds: [430, 1484, 893] },
        ];

        let finalCategories = [];

        groups.forEach((group) => {
          if (group.id === 1000) {
            // "Tất Cả" = tổng tất cả sản phẩm
            const total = withProducts.reduce((sum, cat) => sum + cat.count, 0);
            if (total > 0) {
              finalCategories.push({
                id: group.id,
                name: group.name,
                count: total,
                childrenIds: [],
              });
            }
          } else {
            const count = withProducts
              .filter((cat) => group.childrenIds.includes(cat.id))
              .reduce((sum, cat) => sum + cat.count, 0);

            if (count > 0) {
              finalCategories.push({
                id: group.id,
                name: group.name,
                count,
                childrenIds: group.childrenIds,
              });
            }
          }
        });

        // ❌ Không thêm leftovers nữa
        setCategories(finalCategories);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <View style={{ padding: 10, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={{ marginVertical: 10 }}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedCategory?.id === item.id;
          return (
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                isSelected && styles.selectedCategoryBtn,
              ]}
              onPress={() =>
                onSelectCategory({ id: item.id, childrenIds: item.childrenIds })
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.selectedCategoryText,
                ]}
              >
                {item.name} ({item.count})
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryBtn: {
    backgroundColor: "#4CAF50",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "700",
  },
});

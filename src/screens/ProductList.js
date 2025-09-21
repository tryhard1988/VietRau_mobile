// screens/ProductList.js
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import ProductItem from "../components/ProductItem";
import ProductDetail from "./ProductDetail";
import BannerSlider from "../components/BannerSlider";
import HeaderTop from "../components/HeaderTop";
import CategoryList from "../components/CategoryList";

import {
  fetchProducts,
  resetProducts,
  selectProducts,
  selectProductsLoading,
  selectSearchQuery,
  setSearchQuery,
  setCategoryIds,
  selectCategoryIds,
} from "../store/reducers/ProductReducer";

// Layout config
const MIN_ITEM_WIDTH = 180;
const ITEM_MARGIN = 10;
const PER_PAGE = 20;

// Helper: bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
  if (!str) return "";
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  return str.toLowerCase();
};

export default function ProductList() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Redux state
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const searchQuery = useSelector(selectSearchQuery);
  const categoryIds = useSelector(selectCategoryIds);

  // Local state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [screenWidth] = useState(Dimensions.get("window").width);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 👉 Local inputText cho search box
  const [inputText, setInputText] = useState(searchQuery);

  // Layout columns
  const NUM_COLUMNS = Math.floor(screenWidth / MIN_ITEM_WIDTH) || 2;
  const ITEM_WIDTH =
    (screenWidth - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  // Load lần đầu
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, per_page: PER_PAGE }));
    setPage(2);
  }, [dispatch]);

  // Search khi nhấn Enter
  const handleSearchSubmit = () => {
    dispatch(setSearchQuery(inputText)); // lưu vào redux
    dispatch(resetProducts());
    dispatch(fetchProducts({ page: 1, per_page: PER_PAGE, search: inputText, categoryIds }));
    setPage(2);
    setHasMore(true);
  };

  // Chọn category
 const handleCategorySelect = (cat) => {
  let ids = [];

  if (cat.id === 1000) {
    // 👉 "Tất Cả" => không filter theo category
    ids = [];
  } else {
    ids = [cat.id, ...(cat.childrenIds || [])];
  }

  setSelectedCategory(cat);

  dispatch(setCategoryIds(ids));
  dispatch(resetProducts());
  dispatch(fetchProducts({ page: 1, per_page: PER_PAGE, search: searchQuery, categoryIds: ids }));

  setPage(2);
  setHasMore(true);
};

  // Infinite scroll
  // Infinite scroll
  const handleEndReached = () => {
    if (!loading && hasMore) {
      dispatch(fetchProducts({ page, per_page: PER_PAGE, search: searchQuery, categoryIds }))
        .unwrap()
        .then((res) => {
          if (!res || !res.data || res.data.length === 0 || page >= res.totalPages) {
            setHasMore(false);
          } else {
            setPage((prev) => prev + 1);
          }
        })
        .catch(() => setHasMore(false));
    }
  };


  // Lọc search local (fallback để chính xác hơn)
  const filteredProducts = products.filter((item) =>
    removeVietnameseTones(item.name).includes(removeVietnameseTones(searchQuery))
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderTop
        searchQuery={inputText}            // 👈 dùng local input
        setSearchQuery={setInputText}      // 👈 chỉ update state local
        onSubmitSearch={handleSearchSubmit} // 👈 nhấn Enter mới search
        onCartPress={() => navigation.navigate("Cart")}
      />

      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Loading khi đổi category */}
      {loading && products.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#00c6ff" />
          <Text style={{ marginTop: 10 }}>Đang tải sản phẩm...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <ProductItem
              item={item}
              itemWidth={ITEM_WIDTH}
              onPress={() => setSelectedProduct(item)}
            />
          )}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: ITEM_MARGIN,
            marginBottom: ITEM_MARGIN,
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && products.length > 0 ? (
              <ActivityIndicator style={{ margin: 10 }} />
            ) : null
          }
          contentContainerStyle={{ paddingTop: ITEM_MARGIN }}
          ListHeaderComponent={<BannerSlider />}
          ListHeaderComponentStyle={{ marginBottom: 10 }}
        />
      )}

      {/* Modal chi tiết sản phẩm */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </View>
  );
}

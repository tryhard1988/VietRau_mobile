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

  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const searchQuery = useSelector(selectSearchQuery);
  const categoryIds = useSelector(selectCategoryIds);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [screenWidth] = useState(Dimensions.get("window").width);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [inputText, setInputText] = useState(""); // local search input
  const [selectedCategory, setSelectedCategory] = useState(null); // local category

  const NUM_COLUMNS = Math.floor(screenWidth / MIN_ITEM_WIDTH) || 2;
  const ITEM_WIDTH =
    (screenWidth - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  // Load lần đầu
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, per_page: PER_PAGE }));
    setPage(2);
  }, [dispatch]);

  // -------------------- Search --------------------
  const handleSearchSubmit = () => {
    dispatch(setSearchQuery(inputText)); // lưu search vào redux
    dispatch(setCategoryIds([]));         // bỏ category
    dispatch(resetProducts());
    dispatch(fetchProducts({ page: 1, per_page: PER_PAGE, search: inputText }));
    setPage(2);
    setHasMore(true);
    setSelectedCategory(null);
  };

  // -------------------- Category --------------------
  const handleCategorySelect = (cat) => {
    let ids = cat.id === 1000 ? [] : [cat.id, ...(cat.childrenIds || [])];
    setSelectedCategory(cat);

    dispatch(setCategoryIds(ids));
    dispatch(setSearchQuery("")); // bỏ search
    dispatch(resetProducts());
    dispatch(fetchProducts({ page: 1, per_page: PER_PAGE, categoryIds: ids }));
    setPage(2);
    setHasMore(true);
    setInputText(""); // clear local input
  };

  // -------------------- Infinite scroll --------------------
  const handleEndReached = () => {
    if (!loading && hasMore) {
      dispatch(
        fetchProducts({
          page,
          per_page: PER_PAGE,
          search: searchQuery,
          categoryIds,
        })
      )
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

  const filteredProducts = products.filter((item) =>
    removeVietnameseTones(item.name).includes(removeVietnameseTones(searchQuery))
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderTop
        searchQuery={inputText}
        setSearchQuery={setInputText}
        onSubmitSearch={handleSearchSubmit}
        onCartPress={() => navigation.navigate("Cart")}
      />

      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

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

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </View>
  );
}

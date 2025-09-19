import React, { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import ProductItem from "../components/ProductItem";
import ProductDetail from "./ProductDetail";
import BannerSlider from "../components/BannerSlider";
import HeaderTop from "../components/HeaderTop";
import { fetchProducts, resetProducts, selectProducts, selectProductsLoading } from "../store/reducers/ProductReducer";

const MIN_ITEM_WIDTH = 180;
const ITEM_MARGIN = 10;
const PER_PAGE = 20;

// Hàm loại bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
  if (!str) return '';
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  return str.toLowerCase();
};

export default function ProductList() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [screenWidth] = useState(Dimensions.get("window").width);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const NUM_COLUMNS = Math.floor(screenWidth / MIN_ITEM_WIDTH) || 2;
  const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  // Load products (pagination)
  const loadProducts = async (pageNum) => {
    if (loading || !hasMore) return;
    const resultAction = await dispatch(fetchProducts({ page: pageNum, per_page: PER_PAGE, search: '' })); // fetch tất cả
    if (fetchProducts.fulfilled.match(resultAction)) {
      const fetchedData = resultAction.payload || [];
      if (fetchedData.length === 0) setHasMore(false);
      else setPage(pageNum + 1);
    }
  };

  // Khi submit search
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    dispatch(resetProducts());
    loadProducts(1);
  };

  // Load lần đầu
  useEffect(() => {
    loadProducts(1);
  }, []);

  const handleEndReached = () => {
    if (!loading && hasMore) loadProducts(page);
  };

  // Filter products theo searchQuery bỏ dấu
  const filteredProducts = products.filter(item =>
    removeVietnameseTones(item.name).includes(removeVietnameseTones(searchQuery))
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderTop
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSubmitSearch={handleSearchSubmit}
        onCartPress={() => navigation.navigate("Cart")}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <ProductItem item={item} itemWidth={ITEM_WIDTH} onPress={() => setSelectedProduct(item)} />}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: ITEM_MARGIN, marginBottom: ITEM_MARGIN }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 10 }} /> : null}
        contentContainerStyle={{ paddingTop: ITEM_MARGIN }}
        ListHeaderComponent={<BannerSlider />}
        ListHeaderComponentStyle={{ marginBottom: 10 }}
      />

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </View>
  );
}

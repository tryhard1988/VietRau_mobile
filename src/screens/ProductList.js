//screens/ProductList.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import _ from "lodash";

import ProductItem from "../components/ProductItem";
import ProductDetail from "./ProductDetail";
import BannerSlider from "../components/BannerSlider";
import { fetchProducts } from "../store/reducers/ProductReducer";

const MIN_ITEM_WIDTH = 180;
const ITEM_MARGIN = 10;
const PER_PAGE = 20;

export default function ProductList() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]); // sản phẩm đang hiển thị
  const [nextPageProducts, setNextPageProducts] = useState([]); // sản phẩm preload page tiếp
  const [loading, setLoading] = useState(false); // loading page hiện tại
  const [preloading, setPreloading] = useState(false); // loading page tiếp theo
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [screenWidth] = useState(Dimensions.get("window").width);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const NUM_COLUMNS = Math.floor(screenWidth / MIN_ITEM_WIDTH) || 2;
  const ITEM_WIDTH =
    (screenWidth - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  // Load page hiện tại
  const loadProducts = async (pageNum) => {
    if (loading) return;
    setLoading(true);
    try {
      const resultAction = await dispatch(
        fetchProducts({ page: pageNum, per_page: PER_PAGE })
      );
      if (fetchProducts.fulfilled.match(resultAction)) {
        const fetchedData = resultAction.payload || [];
        if (fetchedData.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prev) => [...prev, ...fetchedData]);
          setPage(pageNum + 1);
          // preload page tiếp theo
          preloadNextPage(pageNum + 1);
        }
      }
    } catch (err) {
      console.error("❌ Load products error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Preload page tiếp theo (không block UI)
  const preloadNextPage = async (nextPageNum) => {
    if (preloading || !hasMore) return;
    setPreloading(true);
    try {
      const resultAction = await dispatch(
        fetchProducts({ page: nextPageNum, per_page: PER_PAGE })
      );
      if (fetchProducts.fulfilled.match(resultAction)) {
        const fetchedData = resultAction.payload || [];
        if (fetchedData.length === 0) {
          setHasMore(false);
        } else {
          setNextPageProducts(fetchedData);
        }
      }
    } catch (err) {
      console.error("❌ Preload next page error:", err.message);
    } finally {
      setPreloading(false);
    }
  };

  // Khi scroll tới cuối, merge nextPageProducts vào products
  const handleEndReached = useCallback(() => {
    if (nextPageProducts.length > 0) {
      setProducts((prev) => [...prev, ...nextPageProducts]);
      setNextPageProducts([]);
      preloadNextPage(page);
    }
  }, [nextPageProducts, page]);

  useEffect(() => {
    loadProducts(1); // load page 1 khi mount
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffffff" }}>      
      <FlatList
        data={products}
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
          loading || preloading ? <ActivityIndicator style={{ margin: 10 }} /> : null
        }
        contentContainerStyle={{ paddingTop: ITEM_MARGIN }}
        ListHeaderComponent={<BannerSlider />}
        ListHeaderComponentStyle={{ marginBottom: 10 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={4}
        removeClippedSubviews
        decelerationRate={0.8} 
        showsVerticalScrollIndicator={false} 
      />

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </View>
  );
}

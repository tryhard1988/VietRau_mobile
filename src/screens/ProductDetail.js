//screens/ProductDetail.js
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/reducers/CartReducer";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const START_Y = SCREEN_HEIGHT * 0.75;
const END_Y = SCREEN_HEIGHT * 0.25;

export default function ProductDetail({ product, onClose }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const translateY = useRef(new Animated.Value(START_Y)).current;
  const offsetY = useRef(START_Y);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newY = offsetY.current + gestureState.dy;
        if (newY < END_Y) newY = END_Y;
        if (newY > START_Y) newY = START_Y;
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose = gestureState.dy > 100;
        const toValue = shouldClose ? SCREEN_HEIGHT : END_Y;
        if (shouldClose) {
          setTimeout(() => {
            onClose();
          }, 150);
        }
        Animated.spring(translateY, {
          toValue,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    if (product) {
      offsetY.current = START_Y;
      translateY.setValue(START_Y);
      Animated.timing(translateY, {
        toValue: END_Y,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        offsetY.current = END_Y;
      });
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
  dispatch(
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0]?.src || null, // 👈 lấy ảnh đầu tiên
      quantity,
    })
  );
  onClose();
};

  return (
    <Modal visible={!!product} transparent animationType="none">
      <TouchableWithoutFeedback
        onPress={() => {
          setTimeout(() => onClose(), 150);
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }}
      >
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.content, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        {product.images?.[0]?.src && (
          <Image source={{ uri: product.images[0].src }} style={styles.image} />
        )}
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price} VND</Text>
        <Text style={styles.description}>
          {product.description || "Không có mô tả"}
        </Text>

        {/* Chọn số lượng */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Nút thêm vào giỏ */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addBtnText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: SCREEN_HEIGHT * 0.75,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  image: { width: "100%", height: 250, borderRadius: 8, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  price: { fontSize: 18, color: "#ff5900", marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 22, color: "#444", marginBottom: 15 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  qtyText: { fontSize: 18 },
  qtyNumber: { marginHorizontal: 12, fontSize: 16 },
  addBtn: {
    backgroundColor: "#45BA7A",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

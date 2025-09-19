//screens/CartScreen.js
import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert  } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotalPrice,
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../store/reducers/CartReducer"

export default function CartScreen({ navigation }) {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const dispatch = useDispatch();

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.price.toLocaleString()} đ</Text>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => dispatch(decreaseQuantity(item.id))}
            style={styles.btn}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => dispatch(addToCart({ ...item, quantity: 1 }))}
            style={styles.btn}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
            Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn xóa sản phẩm này?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", style: "destructive", onPress: () => dispatch(removeFromCart(item.id)) }
            ]
            )
        }
        >
        <Text style={{ color: "red" }}>X</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {cartItems.length === 0 ? (
        <Text>🛒 Giỏ hàng trống</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Tổng: {totalPrice.toLocaleString()} đ</Text>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate("Checkout", { cartItems })}
            >
              <Text style={{ color: "#fff" }}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  image: { width: 60, height: 60, borderRadius: 8 },
  info: { flex: 1, marginLeft: 10 },
  name: { fontWeight: "bold" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  btn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: { fontSize: 18, fontWeight: "bold" },
  checkoutBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
});

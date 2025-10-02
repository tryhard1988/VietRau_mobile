//screens/CheckoutScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
    selectCartItems,
    selectCartTotalPrice,
    clearCart,
} from "../store/reducers/CartReducer";

import { createOrderApi } from "../api/orderApi"; // import API tạo đơn hàng

export default function CheckoutScreen({ navigation }) {
    const cartItems = useSelector(selectCartItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConfirmOrder = async () => {
        if (!name || !phone || !address) {
            Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const orderData = {
            payment_method: "cod", // thanh toán khi nhận hàng
            payment_method_title: "Thanh toán khi nhận hàng",
            status: "processing",
            billing: {
                first_name: name,
                phone: phone,
                address_1: address,
            },            
            shipping: {
                first_name: name,
                address_1: address,
            },
            line_items: cartItems.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
        };

        setLoading(true);
        try {
            const result = await createOrderApi(orderData); // gọi API
            console.log("Order created:", result);

            Alert.alert(
                "✅ Thành công",
                "Đơn hàng của bạn đã được đặt!\nPhương thức thanh toán: Thanh toán khi nhận hàng"
            );

            dispatch(clearCart());
            navigation.navigate("Home"); // quay về màn hình sản phẩm
        } catch (err) {
            console.log(err);
            Alert.alert("❌ Lỗi", "Không thể tạo đơn hàng. Thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <View style={{ flex: 1, marginLeft: item.image ? 10 : 0 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>Số lượng: {item.quantity}</Text>
                <Text>Giá: {(item.price * item.quantity).toLocaleString()} đ</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, padding: 15 }}>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListHeaderComponent={<Text style={styles.sectionTitle}>Sản phẩm</Text>}
            />

            <Text style={styles.total}>Tổng: {totalPrice.toLocaleString()} đ</Text>

            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
            <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={[styles.input, { height: 70 }]}
                placeholder="Địa chỉ"
                value={address}
                onChangeText={setAddress}
                multiline
            />

            {/* Phương thức thanh toán */}
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            <View style={styles.paymentCard}>
                <Text style={styles.paymentIcon}>💵</Text>
                <Text style={styles.paymentText}>Thanh toán khi nhận hàng</Text>
            </View>

            {/* Nút xác nhận */}
            <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirmOrder}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmText}>Xác nhận đặt hàng</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
    item: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" },
    image: { width: 60, height: 60, borderRadius: 8 },
    name: { fontSize: 15, fontWeight: "500" },
    total: { fontSize: 18, fontWeight: "bold", marginVertical: 15, color: "green" },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 10 },
    paymentRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
    paymentCard: {
        flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#45BA7A", backgroundColor: "#e6f5ef", // màu nền nhạt để nổi bật  marginBottom: 15,
    },
    paymentIcon: { fontSize: 20, marginRight: 8, color: "#45BA7A" },
    paymentText: { fontSize: 16, fontWeight: "bold", color: "#333" },
    confirmBtn: { backgroundColor: "#45BA7A", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

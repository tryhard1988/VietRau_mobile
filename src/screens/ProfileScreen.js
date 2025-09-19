// screens/ProfileScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight : 20;

export default function ProfileScreen() {
    const navigation = useNavigation();
    const loggedIn = false; // Thay bằng logic kiểm tra user thực tế

    const handleLoginPress = () => {
        navigation.navigate("Login"); // Điều hướng sang màn hình Login
    };

    return (
        <View style={styles.container}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Tôi</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {loggedIn ? (
                    <>
                        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
                        <Text>Họ và tên: Nguyễn Văn A</Text>
                        <Text>Email: user@example.com</Text>
                        <Text>Số điện thoại: 0123456789</Text>
                    </>
                ) : (
                    <TouchableOpacity style={styles.loginBtn} onPress={handleLoginPress}>
                        <Text style={styles.loginText}>Đăng nhập</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingTop: STATUSBAR_HEIGHT,
        height: STATUSBAR_HEIGHT + 50,
        backgroundColor: "#45BA7A",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    backBtn: {
        width: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center", // căn giữa theo chiều dọc
        alignItems: "center",     // căn giữa theo chiều ngang
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    loginBtn: {
        backgroundColor: "#6FD29F",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        elevation: 3,
    },
    loginText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

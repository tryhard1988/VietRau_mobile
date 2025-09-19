// screens/ProfileScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight : 20;

export default function ProfileScreen() {
    const navigation = useNavigation();

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
                <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
                <Text>Họ và tên: Nguyễn Văn A</Text>
                <Text>Email: user@example.com</Text>
                <Text>Số điện thoại: 0123456789</Text>
                {/* Thêm các nút cập nhật thông tin, đổi mật khẩu ... */}
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
    backText: {
        fontSize: 20,
        color: "#fff",
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
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

// screens/AboutScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from "react-native";

const banner = require("../assets/company-cover.png"); // ảnh banner

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Công ty Cổ phần Việt Rau</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <Image source={banner} style={styles.banner} resizeMode="cover" />

        {/* Nội dung chính */}
        <Text style={styles.title}>Thông tin công ty</Text>
        <Text style={styles.subText}>- Tên tiếng Việt: Công ty cổ phần Việt Rau</Text>
        <Text style={styles.subText}>- Tên tiếng Anh: Viet Rau Joint Stock Company</Text>
        <Text style={styles.subText}>- Tên viết tắt: Viet Rau JSC</Text>

        <Text style={styles.title}>Thông tin liên hệ</Text>
        <Text style={styles.subText}>- Địa chỉ: Tổ 1, Ấp 4, xã Tân Hiệp, huyện Long Thành, Đồng Nai</Text>
        <Text style={styles.subText}>- Mã số thuế: 0313983703</Text>
        <Text style={styles.subText}>- Email: info@vietrau.com</Text>
        <Text style={styles.subText}>- Website: www.vietrau.com</Text>
        <Text style={styles.subText}>- Mobile: (+84) 909244916</Text>
        <Text style={styles.subText}>- Telephone: (+84) 251 286 0828</Text>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#45BA7A",
    paddingVertical: 15,
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  scrollContent: { padding: 20 },
  banner: { width: width - 40, height: 200, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  subText: {
    fontSize: 16,
    color: "#555", // chữ mờ
    marginBottom: 5,
    paddingLeft: 10, // dịch qua phải
  },
});

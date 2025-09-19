//screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, StatusBar } from "react-native";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/reducers/UserThunks";
import { useNavigation } from "@react-navigation/native";

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight : 20;

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
    setLoading(true);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      Alert.alert("Thành công", "Đăng nhập thành công");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Đăng nhập</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingTop: STATUSBAR_HEIGHT, height: STATUSBAR_HEIGHT + 50, backgroundColor: "#45BA7A", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 },
  backBtn: { width: 40, justifyContent: "center", alignItems: "center" },
  backText: { fontSize: 20, color: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff", flex: 1, textAlign: "center" },
  content: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  button: { backgroundColor: "#45BA7A", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  linkText: { color: "#45BA7A", textAlign: "center", marginTop: 10 },
});

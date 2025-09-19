
// screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, StatusBar } from "react-native";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/reducers/UserThunks";
import { useNavigation } from "@react-navigation/native";

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight : 20;

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        registerUser({
          username: email,       // thêm username
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        })
      ).unwrap();
      Alert.alert("✅ Thành công", "Đăng ký thành công");
      navigation.goBack(); // quay về màn hình login
    } catch (err) {
      const msg = err.message || "Đăng ký thất bại";
      Alert.alert("❌ Lỗi", msg);
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
        <Text style={styles.title}>Đăng ký</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <TextInput style={styles.input} placeholder="Họ" value={lastName} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Tên" value={firstName} onChangeText={setFirstName} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Đang đăng ký..." : "Đăng ký"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: STATUSBAR_HEIGHT,
    height: STATUSBAR_HEIGHT + 50,
    backgroundColor: "#45BA7A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  backBtn: { width: 40, justifyContent: "center", alignItems: "center" },
  backText: { fontSize: 20, color: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff", flex: 1, textAlign: "center" },
  content: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  button: { backgroundColor: "#45BA7A", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  linkText: { color: "#45BA7A", textAlign: "center", marginTop: 10 },
});

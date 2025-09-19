// src/components/HeaderTop.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';  // 👈 import Ionicons
import { selectUser } from '../store/reducers/UserReducer';

export default function HeaderTop({ onCartPress }) {
  const navigation = useNavigation();
  const user = useSelector(selectUser); // lấy thông tin user từ Redux
  const cart = useSelector((state: any) => state.cart);
  const totalItems = cart.length;

  return (
    <View style={styles.container}>
      {/* Bên trái: lời chào hoặc nút đăng nhập */}
      {user.loggedIn ? (
        <Text style={styles.greeting}>Chào, {user.first_name}</Text>
      ) : (
        <View style={styles.authButtons}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.btnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bên phải: giỏ hàng */}
      <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
        <Icon name="cart-outline" size={22} color="#45BA7A" /> 
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#45BA7A',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  authButtons: {
    flexDirection: 'row',
  },
  btn: {
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: '#6FD29F',
    borderRadius: 20,
    elevation: 3,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cartButton: {
    position: 'relative',
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

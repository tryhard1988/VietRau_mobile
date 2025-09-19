import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function HeaderTop({ searchQuery, setSearchQuery, onSubmitSearch, onCartPress }) {
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart || []);
  const totalItems = cart.length;

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.searchWrapper, { backgroundColor: isFocused ? '#fff' : '#8ae4b2ff' }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm sản phẩm..."
          placeholderTextColor="#555"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => onSubmitSearch(searchQuery)}
          autoCorrect={false}
          keyboardType="default"
          textContentType="none"
          autoCapitalize="none"
          spellCheck={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Icon name="search" size={20} color="#555" style={styles.searchIcon} />
      </View>

      <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
        <Icon name="cart-outline" size={24} color="#45BA7A" />
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
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#45BA7A',
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10, // bo góc nhẹ
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 35,
    color: '#000',
    fontSize: 12,
  },
  searchIcon: {
    marginLeft: 8,
  },
  cartButton: {
    marginLeft: 10,
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});

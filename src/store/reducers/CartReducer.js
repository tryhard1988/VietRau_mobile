// store/reducers/CartReducer.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [], // mỗi item: { id, name, price, quantity, ... }
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity = 1 } = action.payload;
      const itemIndex = state.findIndex(item => item.id === id);

      if (itemIndex >= 0) {
        // sản phẩm đã tồn tại → cộng dồn quantity
        state[itemIndex].quantity += quantity;
      } else {
        // sản phẩm mới → thêm vào giỏ
        state.push({ ...action.payload, quantity });
      }
    },

    removeFromCart: (state, action) => {
      // xoá sản phẩm theo id
      return state.filter(item => item.id !== action.payload);
    },

    decreaseQuantity: (state, action) => {
      const itemIndex = state.findIndex(item => item.id === action.payload);
      if (itemIndex >= 0) {
        state[itemIndex].quantity -= 1;
        if (state[itemIndex].quantity <= 0) {
          state.splice(itemIndex, 1); // xoá nếu quantity <= 0
        }
      }
    },

    clearCart: () => {
      // xoá toàn bộ giỏ hàng
      return [];
    },
  },
});

// Selectors
export const selectCartItems = state => state.cart;
export const selectCartTotalQuantity = state =>
  state.cart.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalPrice = state =>
  state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const { addToCart, removeFromCart, decreaseQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

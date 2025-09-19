// store/reducers/ProductReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductsApi } from '../../api/fetchProductsApi';

// Async thunk gọi API WooCommerce với paging
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page }) => {
    const data = await fetchProductsApi(page);
    return data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: [], // state là mảng products
  reducers: {
    resetProducts: () => [] // tùy chọn: reset khi refresh
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      // Append dữ liệu mới vào mảng hiện tại
      return [...state, ...action.payload];
    });
  },
});

export const { resetProducts } = productsSlice.actions;
export default productsSlice.reducer;

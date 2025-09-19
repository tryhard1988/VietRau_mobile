// store/reducers/ProductReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductsApi } from '../../api/fetchProductsApi';

// Async thunk gọi API WooCommerce với paging và search
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, per_page = 20, search = '' }) => {
    const data = await fetchProductsApi({ page, per_page, search });
    return data;
  }
);

const initialState = {
  items: [],        // danh sách sản phẩm
  loading: false,   // trạng thái loading
  error: null,      // lỗi nếu có
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedData = action.payload || [];

        if (action.meta.arg.page === 1) {
          // page 1 => reset items
          state.items = fetchedData;
        } else {
          // page >1 => append nhưng loại trùng id
          const newItems = fetchedData.filter(
            (fd) => !state.items.some((p) => p.id === fd.id)
          );
          state.items = [...state.items, ...newItems];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Selectors
export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export const { resetProducts } = productsSlice.actions;
export default productsSlice.reducer;

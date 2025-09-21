// src/store/reducers/ProductReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsApi } from "../../api/fetchProductsApi";

// Async thunk gọi API WooCommerce
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, per_page = 20, search = "", categoryIds = [] }) => {
    const result = await fetchProductsApi({
      page,
      per_page,
      search,
      category: categoryIds,
    });
    return { ...result, page };
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  total: 0,
  totalPages: 0,
  searchQuery: "",
  categoryIds: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
      state.total = 0;
      state.totalPages = 0;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
      state.items = [];
      state.hasMore = true;
    },
    setCategoryIds: (state, action) => {
      state.categoryIds = action.payload;
      state.page = 1;
      state.items = [];
      state.hasMore = true;
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
        const { data, total, totalPages, page } = action.payload;
        const fetchedData = Array.isArray(data) ? data : [];

        if (page === 1) {
          state.items = fetchedData;
        } else {
          const newItems = fetchedData.filter(
            (fd) => !state.items.some((p) => p.id === fd.id)
          );
          state.items = [...state.items, ...newItems];
        }

        state.page = page;
        state.total = total;
        state.totalPages = totalPages;
        state.hasMore = page < totalPages;

        console.log(
          `✅ Loaded page ${page}/${totalPages}, items: ${state.items.length}`
        );
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
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectCategoryIds = (state) => state.products.categoryIds;
export const selectTotalProducts = (state) => state.products.total;
export const selectTotalPages = (state) => state.products.totalPages;

// Actions
export const { resetProducts, setSearchQuery, setCategoryIds } =
  productsSlice.actions;

export default productsSlice.reducer;

// store/reducers/UserThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserApi, registerUserApi, updateUserApi, loginUserApi } from '../../api/userApi';

// Lấy thông tin user theo ID
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId) => await fetchUserApi(userId)
);

// Đăng ký user mới
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData) => await registerUserApi(userData)
);

// Đăng nhập user
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData) => await loginUserApi(loginData)
);

// Cập nhật thông tin user
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, updateData }) => await updateUserApi(userId, updateData)
);

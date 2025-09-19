// store/reducers/UserReducer.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchUser, registerUser, loginUser, updateUser } from './UserThunks';

const initialState = {
  id: null,
  email: null,
  first_name: null,
  last_name: null,
  phone: null,
  billing: {},
  loggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => initialState, // reset state khi logout
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => ({
        ...state,
        ...action.payload,
        loggedIn: true,
      }))
      .addCase(registerUser.fulfilled, (state, action) => ({
        ...state,
        ...action.payload,
        loggedIn: true,
      }))
      .addCase(loginUser.fulfilled, (state, action) => ({
        ...state,
        ...action.payload,
        loggedIn: true,
      }))
      .addCase(updateUser.fulfilled, (state, action) => ({
        ...state,
        ...action.payload,
      }));
  },
});

export const { logout } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;

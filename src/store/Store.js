import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createNetworkMiddleware, reducer as networkReducer } from 'react-native-offline';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import productReducer from './reducers/ProductReducer';
import cartReducer from './reducers/CartReducer';
import userReducer from './reducers/UserReducer';

// middleware để bắt các action REQUEST khi offline
const networkMiddleware = createNetworkMiddleware({
  regexActionType: /.*\/pending$/,
});

// Root reducer tổng thể
const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  network: networkReducer,
  user: userReducer,
});

// cấu hình persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart', 'user'], // persist cart + user để auto-login
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    networkMiddleware,
    ...getDefaultMiddleware({ serializableCheck: false }), // cần cho redux-persist
  ],
});

export const persistor = persistStore(store);

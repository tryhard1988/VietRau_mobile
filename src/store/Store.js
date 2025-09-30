// store/Store.js
import { configureStore } from '@reduxjs/toolkit';
import { createNetworkMiddleware, reducer as networkReducer } from 'react-native-offline';
import productReducer from './reducers/ProductReducer';
import cartReducer from './reducers/CartReducer';
import userReducer from './reducers/UserReducer';

// middleware để bắt các action REQUEST khi offline
const networkMiddleware = createNetworkMiddleware({
  regexActionType: /.*\/pending$/,
});

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    network: networkReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    [networkMiddleware, ...getDefaultMiddleware()],
});

export default store;

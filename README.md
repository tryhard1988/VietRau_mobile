# Vietrau Mobile App


rd /s /q node_modules

del package-lock.json

npm cache clean --force


npm install fbjs --save

npm install
npm install --legacy-peer-deps
npm install --force



========================== chạy android ==============================================

start cmd /k "npx react-native start --reset-cache"

cd android


rmdir /s /q build
rmdir /s /q app\build

gradlew clean
gradlew assembleDebug --stacktrace
gradlew assembleDebug --stacktrace --info
gradlew assembleDebug

cd ..

npx react-native run-android --no-jetifier


======================================== show log =================================
npx react-native log-android

adb logcat *:S ReactNative:V ReactNativeJS:V

adb logcat *:E




/project-root
│
├─ /src
│   ├─ /api
│   │   └─ woocommerce.js        # File fetch API WooCommerce (dùng axios hoặc RTK Query)
│   │
│   ├─ /components
│   │   ├─ ProductItem.js        # Hiển thị từng sản phẩm, nút add to cart
│   │   └─ CartItem.js           # Hiển thị từng sản phẩm trong giỏ hàng
│   │
│   ├─ /screens
│   │   ├─ ProductsScreen.js     # Màn hình danh sách sản phẩm
│   │   └─ CartScreen.js         # Màn hình giỏ hàng
│   │
│   ├─ /store
│   │   ├─ store.js              # Redux store
│   │   ├─ reducers
│   │   │   ├─ productReducer.js # RTK createSlice cho products
│   │   │   └─ cartReducer.js    # RTK createSlice cho cart
│   │   └─ api
│   │       └─ productsApi.js    # (Nếu dùng RTK Query)
│   │
│   │─ /navigation
│   │    └─ AppNavigator.js       # Stack navigator, Drawer/Tab nếu cần
│   │
│   └─ App.js
│
├─ App.js                        
├─ package.json
└─ .env                          # WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET

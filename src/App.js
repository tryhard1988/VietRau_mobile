//App.js
import React from "react";
import { Provider } from "react-redux";
import { StatusBar, View, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import store from "./store/Store";
import CartScreen from "./screens/CartScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import BottomTabs from "./components/BottomTabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import PostDetailScreen from "./screens/PostDetailScreen";


const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight : 20;

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MyStatusBar backgroundColor="#45BA7A" barStyle="light-content" />
        <NavigationContainer>
          <SafeAreaView style={styles.safeArea}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={BottomTabs} />
              <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{
                  headerShown: true,
                  title: 'Giỏ hàng',
                  headerStyle: { backgroundColor: '#45BA7A' },
                  headerTintColor: '#fff', // màu chữ và nút back
                  headerTitleAlign: 'center',
                }}
              />

              <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{
                  headerShown: true,
                  title: 'Thanh toán',
                  headerStyle: { backgroundColor: '#45BA7A' },
                  headerTintColor: '#fff',
                  headerTitleAlign: 'center',
                }}
              />

              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="PostDetail" component={PostDetailScreen} />

            </Stack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  statusBar: { height: STATUSBAR_HEIGHT },
  safeArea: { flex: 1, backgroundColor: "#fff" },
});

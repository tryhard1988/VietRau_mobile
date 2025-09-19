// components/BottomTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import ProductList from "../screens/ProductList";
import AboutScreen from "../screens/AboutScreen";
import NewsScreen from "../screens/NewsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HeaderTop from "./HeaderTop";

const Tab = createBottomTabNavigator();

export default function BottomTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "ellipse"; // default

          switch (route.name) {
            case "Sản Phẩm":
              iconName = focused ? "cube" : "cube-outline";
              break;
            case "Giới thiệu c.ty":
              iconName = focused ? "business" : "business-outline";
              break;
            case "Tin tức":
              iconName = focused ? "newspaper" : "newspaper-outline";
              break;
            case "Tôi":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#45BA7A",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Sản Phẩm">
        {() => (
          <>            
            <ProductList />
          </>
        )}
      </Tab.Screen>
      <Tab.Screen name="Giới thiệu c.ty" component={AboutScreen} />
      <Tab.Screen name="Tin tức" component={NewsScreen} />
      <Tab.Screen name="Tôi" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

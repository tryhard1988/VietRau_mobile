// components/BannerSlider.js
import React, { useState, useEffect } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_MARGIN = SCREEN_WIDTH * 0.02; // 2% margin 2 bên

export default function BannerSlider() {
  const banners = [
    require("../assets/bg_banner.png"),
    require("../assets/bg_banner.png"),
  ];

  const [imageHeights, setImageHeights] = useState(new Array(banners.length).fill(180));

  // Tính chiều cao theo tỉ lệ ảnh
  useEffect(() => {
    const newHeights = banners.map((img) => {
      const { width, height } = Image.resolveAssetSource(img);
      const ratio = height / width;
      return (SCREEN_WIDTH - HORIZONTAL_MARGIN * 2) * ratio;
    });
    setImageHeights(newHeights);
  }, []);

  const maxHeight = Math.max(...imageHeights);

  return (
    <View style={[styles.container, { height: maxHeight }]}>
      <Carousel
        width={SCREEN_WIDTH - HORIZONTAL_MARGIN * 2} // để banner cách 2% 2 bên
        height={maxHeight}
        data={banners}
        autoPlay
        autoPlayInterval={3000}       // thời gian chờ auto-slide
        scrollAnimationDuration={2000} // tốc độ scroll
        loop
        style={{ marginHorizontal: HORIZONTAL_MARGIN }}
        renderItem={({ item, index }) => (
          <Image
            source={item}
            style={{
              width: SCREEN_WIDTH - HORIZONTAL_MARGIN * 2 + 1,
              height: imageHeights[index],
              resizeMode: "cover",
              borderRadius: 8,
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10, // khoảng cách trên/dưới
  },
});

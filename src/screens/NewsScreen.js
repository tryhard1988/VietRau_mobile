// screens/NewsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, Platform, StatusBar } from "react-native";
import axios from "axios";

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight : 20;
const WC_API_URL_NEWS = "https://vietrau.com/wp-json/wp/v2/posts";
const PLACEHOLDER = require("../assets/bg_banner.png"); // ảnh mặc định

function PostItem({ item, index, navigation }) {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (item.featured_media) {
        try {
          const res = await axios.get(`https://vietrau.com/wp-json/wp/v2/media/${item.featured_media}`);
          setThumbnail(res.data.source_url);
        } catch (err) {
          setThumbnail(null);
        }
      }
    };
    fetchThumbnail();
  }, [item.featured_media]);

  const text = item.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "");
  const shortText = text.length > 80 ? text.substring(0, 80) + "..." : text;

  const isEven = index % 2 === 0;
  const rowStyle = {
    flexDirection: isEven ? "row" : "row-reverse",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  };

  return (
    <TouchableOpacity
      style={rowStyle}
      onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
    >
      <View style={{ flex: 1, paddingRight: isEven ? 10 : 0, paddingLeft: isEven ? 0 : 10 }}>
        <Text style={styles.postTitle}>{item.title.rendered}</Text>
        <Text style={styles.postDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.postExcerpt} numberOfLines={2} ellipsizeMode="tail">{shortText}</Text>
      </View>

      <Image
        source={thumbnail ? { uri: thumbnail } : PLACEHOLDER}
        style={styles.postThumbnail}
      />
    </TouchableOpacity>
  );
}

export default function NewsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // page hiện tại
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true); // còn bài để load không

  const fetchPosts = async (pageNum = 1) => {
    try {
      const res = await axios.get(WC_API_URL_NEWS, { params: { page: pageNum, per_page: 10 } });
      if (pageNum === 1) {
        setPosts(res.data);
      } else {
        setPosts(prev => [...prev, ...res.data]);
      }

      // Nếu số bài trả về < per_page, không còn bài để load
      setHasMore(res.data.length === 10);
    } catch (err) {
      if (pageNum === 1) setError("Lấy dữ liệu thất bại");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  if (loading && page === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#45BA7A" />
      </View>
    );
  }

  if (error && page === 1) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Tin tức</Text>
      </View>

      {/* FlatList */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <PostItem item={item} index={index} navigation={navigation} />}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator color="#45BA7A" /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red" },
  header: {
    paddingTop: STATUSBAR_HEIGHT,
    paddingBottom: 10, // khoảng padding dưới text
    backgroundColor: "#45BA7A",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  list: { padding: 20 },
  postTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  postDate: { fontSize: 14, color: "#888", marginBottom: 5 },
  postExcerpt: { fontSize: 16, color: "#555" },
  postThumbnail: {
    width: 100,
    height: 80,
    resizeMode: "cover",
    borderRadius: 5,
  },
});

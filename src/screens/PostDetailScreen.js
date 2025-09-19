// screens/PostDetailScreen.js
import React, { Component } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import RenderHtml from "react-native-render-html";

const { width: screenWidth } = Dimensions.get("window");
const PLACEHOLDER = require("../assets/bg_banner.png");

export default class PostDetailScreen extends Component {
    state = {
        post: null,
        loading: true,
        error: "",
    };

    componentDidMount() {
        this.fetchPost();
    }

    fetchPost = async () => {
        const { postId } = this.props.route.params;
        try {
            const res = await axios.get(`https://vietrau.com/wp-json/wp/v2/posts/${postId}`);
            const post = res.data;

            // Lấy ảnh đại diện nếu có
            let featuredImage = null;
            if (post.featured_media) {
                const mediaRes = await axios.get(`https://vietrau.com/wp-json/wp/v2/media/${post.featured_media}`);
                featuredImage = mediaRes.data.source_url;
            }

            this.setState({ post: { ...post, featuredImage }, loading: false });
        } catch (err) {
            console.log(err);
            this.setState({ error: "Lấy dữ liệu thất bại", loading: false });
        }
    };

    render() {
        const { post, loading, error } = this.state;
        const { navigation } = this.props;

        if (loading) return <ActivityIndicator size="large" color="#45BA7A" style={styles.center} />;
        if (error) return <Text style={styles.error}>{error}</Text>;

        const source = { html: post.content.rendered };

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backText}>◀</Text>
                    </TouchableOpacity>

                    {/* Tiêu đề động từ post.title */}
                    <Text
                        style={styles.headerTitle}
                        numberOfLines={1} // giới hạn 1 dòng nếu tiêu đề quá dài
                        ellipsizeMode="tail" // nếu dài thì hiển thị ...
                    >
                        {post.title.rendered}
                    </Text>

                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>{post.title.rendered}</Text>

                    {/* Ảnh đại diện */}
                    <Image
                        source={post.featuredImage ? { uri: post.featuredImage } : PLACEHOLDER}
                        style={{ width: screenWidth - 40, height: 200, resizeMode: "contain", marginBottom: 10 }}
                    />

                    {/* Nội dung bài viết */}
                    <RenderHtml
                        contentWidth={screenWidth - 40}
                        source={source}
                        defaultTextProps={{ selectable: true }}
                        tagsStyles={{ img: { marginBottom: 10 } }}
                        renderers={{
                            img: ({ TDefaultRenderer, ...props }) => {
                                const { tnode } = props;

                                // Lấy src từ src hoặc data-src
                                let src = tnode.attributes.src || tnode.attributes["data-src"] || "";
                                if (!src) {
                                    // Kiểm tra trong noscript nếu có
                                    const html = tnode.domNode?.innerHTML || "";
                                    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
                                    if (match && match[1]) src = match[1];
                                }

                                // Nếu relative path thì thêm domain
                                if (src && src.startsWith("/")) src = `https://vietrau.com${src}`;

                                return (
                                    <Image
                                        source={src ? { uri: src } : PLACEHOLDER}
                                        style={{ width: screenWidth - 40, height: 200, resizeMode: "contain", marginBottom: 10 }}
                                    />
                                );
                            },
                        }}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: { height: 60, backgroundColor: "#45BA7A", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 },
    backBtn: { width: 40, justifyContent: "center", alignItems: "center" },
    backText: { fontSize: 20, color: "#fff" },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", flex: 1, textAlign: "center" },
    container: { padding: 20 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    error: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

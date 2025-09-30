// src/api/fetchProductsApi.js
import axios from "axios";
import { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } from "@env";

/**
 * Fetch products từ WooCommerce với paging, search, category
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.per_page
 * @param {string} params.search
 * @param {number|number[]} params.category
 */
export const fetchProductsApi = async ({ page = 1, per_page = 20, search = "", category }) => {
  try {
    const params = {
      consumer_key: WC_CONSUMER_KEY,
      consumer_secret: WC_CONSUMER_SECRET,
      page,
      per_page,
      _fields: "id,name,price,images,description",
    };

    if (search && search.trim() !== "") {
      params.search = search.trim();
    }

    if (category !== undefined) {
      params.category = Array.isArray(category) ? category.join(",") : category;
    }

    const res = await axios.get(`${WC_API_URL}/products`, { params });

    return {
      data: res.data || [],
      total: parseInt(res.headers["x-wp-total"] || "0", 10),
      totalPages: parseInt(res.headers["x-wp-totalpages"] || "0", 10),
    };
  } catch (error) {
    console.error("❌ fetchProductsApi error:", error.response?.data || error.message);
    return { data: [], total: 0, totalPages: 0 };
  }
};

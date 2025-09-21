// src/api/fetchCategoriesApi.js
import axios from "axios";
import { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } from "@env";

/**
 * Fetch WooCommerce product categories
 * @returns {Promise<Array>}
 */
export const fetchCategoriesApi = async () => {
  const res = await axios.get(`${WC_API_URL}/products/categories`, {
    params: {
      per_page: 50, // lấy tối đa 50 categories, tùy bạn chỉnh
      consumer_key: WC_CONSUMER_KEY,
      consumer_secret: WC_CONSUMER_SECRET,
    },
  });

  return res.data;
};

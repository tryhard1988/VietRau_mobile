// store/api/userApi.js
import axios from "axios";
import { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } from "@env";

/**
 * 1. Lấy thông tin user theo ID
 */
export const fetchUserApi = async (userId) => {
  try {
    const res = await axios.get(`${WC_API_URL}/customers/${userId}`, {
      auth: {
        username: WC_CONSUMER_KEY,
        password: WC_CONSUMER_SECRET,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Fetch user failed");
  }
};

/**
 * 2. Đăng ký user mới
 */
export const registerUserApi = async ({ email, first_name, last_name, username, password }) => {
  try {
    const res = await axios.post(
      `${WC_API_URL}/customers`,
      { email, first_name, last_name, username, password },
      {
        auth: {
          username: WC_CONSUMER_KEY,
          password: WC_CONSUMER_SECRET,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Register failed");
  }
};

/**
 * 3. Cập nhật thông tin user
 */
export const updateUserApi = async (userId, data) => {
  try {
    const res = await axios.put(`${WC_API_URL}/customers/${userId}`, data, {
      auth: {
        username: WC_CONSUMER_KEY,
        password: WC_CONSUMER_SECRET,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Update user failed");
  }
};

/**
 * 4. Login user (dùng JWT Authentication plugin)
 *    map email → username
 */
export const loginUserApi = async ({ email, password }) => {
  try {
    const res = await axios.post(`${WC_API_URL}/jwt-auth/v1/token`, {
      username: email, // WooCommerce JWT dùng username → map email
      password,
    });
    return {
      token: res.data.token,
      id: res.data.user_id,
      email: res.data.user_email,
      first_name: res.data.user_nicename, // bạn có thể map lại nếu muốn
      last_name: "", // JWT API mặc định không trả last_name
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// store/api/orderApi.js
import axios from "axios";
import { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } from "@env";

export const createOrderApi = async (orderData) => {
  const res = await axios.post(`${WC_API_URL}/orders`, orderData, {
    auth: {
      username: WC_CONSUMER_KEY,
      password: WC_CONSUMER_SECRET,
    },
  });
  return res.data;
};

// store/api/fetchProductsApi.js
import axios from 'axios';
import { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } from '@env';

export const fetchProductsApi = async (page = 1) => {
  const res = await axios.get(`${WC_API_URL}/products`, {
    params: {
      per_page: 20,
      page,
      _fields: 'id,name,price,images,description',
      consumer_key: WC_CONSUMER_KEY,
      consumer_secret: WC_CONSUMER_SECRET,
    },
  });
  return res.data;
};

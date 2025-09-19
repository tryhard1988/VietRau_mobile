import axios from 'axios';
import { WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } from '@env';

/**
 * Fetch products từ WooCommerce với paging và search
 * @param {Object} params
 * @param {number} params.page - số trang
 * @param {number} params.per_page - số sản phẩm/trang
 * @param {string} params.search - chuỗi tìm kiếm
 */
export const fetchProductsApi = async ({ page = 1, per_page = 20, search = '' } = {}) => {
  const res = await axios.get(`${WC_API_URL}/products`, {
    params: {
      per_page,
      page,
      _fields: 'id,name,price,images,description',
      search: search ? encodeURIComponent(search) : undefined, // encode để URL hợp lệ
      consumer_key: WC_CONSUMER_KEY,
      consumer_secret: WC_CONSUMER_SECRET,
    },
  });

  let data = res.data;

  // Lọc client nếu search có dấu (tiếng Việt)
  if (search) {
    const normalizedSearch = search
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    data = data.filter(p =>
      p.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }

  return data;
};

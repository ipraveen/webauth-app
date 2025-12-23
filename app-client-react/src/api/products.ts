import axios from '@/api/axios';
import type { Product } from '@/types';

export const getProducts = async () => {
    const { data } = await axios.get<Product[]>('/products');
    return data;
};

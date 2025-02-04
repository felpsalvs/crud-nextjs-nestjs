import { api } from '@/services/api';
import { Product } from '../domain/Product';

export const fetchProducts = async (queryKey: string) => {
  const response = await api.get(queryKey);
  return response.data;
};

export const createProduct = async (productData: { name: string }) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/products/${id}`);
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};
'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import useSWR, { mutate } from 'swr';
import { debounce } from 'lodash';
import axios from 'axios';
import { handleSWRError } from '@/lib/swr-config';
import { NEXT_PUBLIC_GEMINI_API_KEY } from '@/config/env';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ProductsContextType {
  error: any;
  product: Product;
  products: Product[];
  isLoading: boolean;
  productDialogOpen: boolean;
  loadingCreateProduct: boolean;
  deletingId: string | null;
  handleSearch: (value: string) => void;
  setProduct: (product: Product) => void;
  createProduct: (product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setProductDialogOpen: (open: boolean) => void;
  mutateList: () => void;
  meta: any;
  search: string;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<Product>({ id: '', name: '', description: '', price: 0 });
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [loadingCreateProduct, setLoadingCreateProduct] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const baseKey = '/products';
  const queryKey = `${baseKey}?page=${page}&limit=10&search=${search}`;

  const { data, error, isLoading, mutate: mutateGetProducts } = useSWR(
    queryKey,
    async () => {
      try {
        const response = await api.get(queryKey);
        return response.data;
      } catch (err) {
        handleSWRError(err);
        throw err;
      }
    }
  );

  const generateProductDetails = async (productName: string) => {
    const INICIAL_PROMPT = `You are a product description generator. Create a JSON object for "${productName}" following exactly this structure, without any additional text or formatting:
    {
      "description": "Write a concise and professional product description",
      "suggestedPrice": <number between 50 and 500>
    }`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: INICIAL_PROMPT },
            { text: productName }
          ]
        }
      ]
    };

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`,
        requestBody,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '';

      if (!jsonString) {
        console.error('No valid JSON found in response');
        return { description: '', price: 0 };
      }

      const parsed = JSON.parse(jsonString);
      const description = parsed.description || '';
      const price = parsed.suggestedPrice || 0;


      return { description, price };
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return { description: '', price: 0 };
    }
  };

  const createProduct = async (product: Partial<Product>) => {
    setLoadingCreateProduct(true);
    try {
      await api.post('/products', product);
      await mutateGetProducts();
      toast({ title: "Success", description: "Product created successfully" });
      setProduct({ id: '', name: '', description: '', price: 0 });
      setProductDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    } finally {
      setLoadingCreateProduct(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`${baseKey}/${id}`);
      await mutate((key: string) => key.startsWith(baseKey));

      toast({ title: "Deleted", description: "Product successfully deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const updateProductWithAI = useCallback(
    debounce(async (newName: string) => {
      if (!newName) return;
      const { description, price } = await generateProductDetails(newName);
      setProduct((prev) => ({ ...prev, name: newName, description, price }));
    }, 1000),
    []
  );

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 300),
    []
  );

  return (
    <ProductsContext.Provider
      value={{
        products: data?.items ?? [],
        meta: data?.meta,
        error,
        isLoading,
        createProduct,
        deleteProduct,
        loadingCreateProduct,
        deletingId,
        productDialogOpen,
        setProductDialogOpen,
        product,
        setProduct: (product) => {
          setProduct(product);
          updateProductWithAI(product.name);
        },
        mutateList: mutateGetProducts,
        setPage,
        setSearch,
        search,
        handleSearch,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within a ProductsProvider");
  return context;
};

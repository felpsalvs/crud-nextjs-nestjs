"use client"

import Layout from '@/components/Layout';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage = ({ params }: ProductPageProps) => {
  const { id } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [videos, setVideos] = useState<{ url: string }[]>([]);
  const [mediaLoading, setMediaLoading] = useState<boolean>(true);

  const MAX_DESCRIPTION_LENGTH = 325;
  const IMAGE_PLACEHOLDER_URL = 'https://static.vecteezy.com/system/resources/thumbnails/003/559/330/small_2x/abstract-background-with-gradient-blue-bubble-free-vector.jpg';
  const VIDEO_MAX_RESULTS = 5;

  const TRANSITION_DELAY = 0.5;
  const TRANSITION_DELAY_INCREMENT = 0.2;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchMedia = async (productName: string) => {
      try {
        const imageResponse = await axios.get(`https://api.unsplash.com/search/photos`, {
          params: {
            query: productName,
            client_id: process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID,
            per_page: 1
          }
        });
        setImageUrl(imageResponse.data.results[0]?.urls?.regular || IMAGE_PLACEHOLDER_URL);

        const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: 'snippet',
            q: productName,
            type: 'video',
            maxResults: VIDEO_MAX_RESULTS,
            key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
          }
        });


        const videoItems = videoResponse.data.items.filter((item: any) => !item.id.videoId.includes('shorts'));
        const videoUrls = videoItems.map((item: any) => ({ url: `https://www.youtube.com/watch?v=${item.id.videoId}` }));
        setVideos(videoUrls);

      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setMediaLoading(false);
      }
    };

    if (product) {
      fetchMedia(product.name);
    }
  }, [product]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const productName = capitalize(product.name);
  const description = product.description.length > MAX_DESCRIPTION_LENGTH ? product.description.slice(0, MAX_DESCRIPTION_LENGTH) + '...' : product.description;
  const price = `$${product.price}`;

  return (
    <Layout>
      <motion.div
        className="grid grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TRANSITION_DELAY }}
      >
        <div className="flex justify-center items-start">
          {mediaLoading ? (
            <motion.div
              className="w-full h-[600px] bg-gray-200 animate-pulse rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: TRANSITION_DELAY + TRANSITION_DELAY_INCREMENT }}
            ></motion.div>
          ) : (
            <motion.img
              src={imageUrl}
              alt={productName}
              className="w-full h-[600px] object-cover rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: TRANSITION_DELAY + TRANSITION_DELAY_INCREMENT }}
            />
          )}
        </div>

        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: TRANSITION_DELAY + 2 * TRANSITION_DELAY_INCREMENT }}
        >
          <h1 className="text-black font-bold text-4xl">{productName}</h1>
          <p className="text-black text-base mb-4">{description}</p>
          <div className="bg-black h-[4px] w-[150px] mb-8" />
          <div className="text-black font-bold text-5xl">{price}</div>

          <div className="mt-8">
            <div className="flex overflow-x-auto gap-4 no-scrollbar">
              {mediaLoading ? (
                Array.from({ length: VIDEO_MAX_RESULTS }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-[380px] h-[285px] bg-gray-200 animate-pulse rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * TRANSITION_DELAY_INCREMENT }}
                  ></motion.div>
                ))
              ) : (
                videos.map((video, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-[380px] h-[285px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * TRANSITION_DELAY_INCREMENT }}
                  >
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full bg-cover bg-center rounded-lg"
                      style={{ backgroundImage: `url(https://img.youtube.com/vi/${video.url.split('=')[1]}/hqdefault.jpg)` }}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default ProductPage;

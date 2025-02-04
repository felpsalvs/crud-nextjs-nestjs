import { SWRConfiguration } from 'swr';

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  dedupingInterval: 2000
};

// Separando a função de erro para uso em componentes cliente
export const handleSWRError = (error: any) => {
  console.error('SWR Error:', error);
};
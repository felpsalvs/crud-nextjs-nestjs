'use client';

import { ProductGrid } from "./presentational/ProductGrid";
import { ErrorState } from "./presentational/ErrorState";
import { LoadingState } from "./presentational/LoadingState";
import { EmptyProductList } from "./presentational/EmptyProductList";
import { useProducts } from "../../context/ProductsContext";

export function ProductListContainer() {
  const {
    products,
    meta,
    error,
    isLoading,
    deleteProduct,
    deletingId,
    handleSearch,
    setPage,
    search
  } = useProducts();

  if (error) return <ErrorState />;
  if (isLoading) return <LoadingState />;
  if (!products.length) return <EmptyProductList search={search} handleSearch={handleSearch} />;

  return (
    <ProductGrid
      products={products}
      meta={meta}
      search={search}
      handleSearch={handleSearch}
      deleteProduct={deleteProduct}
      deletingId={deletingId}
      setPage={setPage}
    />
  );
}

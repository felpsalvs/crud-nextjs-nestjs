import { useRouter } from "next/navigation";
import { Product } from "@/domains/products/domain/Product";
import { ProductCardPresentational } from "./ProductCardPresentational";

interface ProductCardContainerProps {
  product: Product;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function ProductCardContainer({ product, onDelete, isDeleting }: ProductCardContainerProps) {
  const router = useRouter();

  const handleNavigateToProductDetails = () => {
    router.push(`/products/${product.id}`)
  };

  return (
    <ProductCardPresentational
      product={product}
      onDelete={onDelete}
      isDeleting={isDeleting}
      handleNavigateToProductDetails={handleNavigateToProductDetails}
    />
  );
}

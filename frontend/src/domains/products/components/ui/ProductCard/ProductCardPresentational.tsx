import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/domains/products/domain/Product";
import { Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
  handleNavigateToProductDetails: () => void;
}

export function ProductCardPresentational({ product, onDelete, isDeleting, handleNavigateToProductDetails }: ProductCardProps) {
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(product.id);
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex justify-between items-start gap-4">
            <span className="line-clamp-2 cursor-pointer" onClick={handleNavigateToProductDetails}>
              {capitalize(product.name)}
            </span>
            <span className="text-green-600 font-bold whitespace-nowrap">
              {formatCurrency(product.price)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
          {product.aiSuggestions?.features && (
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold">Features:</h4>
              <ul className="list-disc list-inside space-y-1">
                {product.aiSuggestions.features.map((feature, i) => (
                  <li key={i} className="text-sm text-gray-600 line-clamp-1">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

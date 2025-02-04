import { Pagination } from "@/components/Pagination";
import { Search } from "@/components/Search";
import { ProductCardContainer } from "../../ProductCard/ProductCardContainer";
import { CreateProductContainer } from "../../CreateProduct/CreateProductContainer";

export function ProductGrid({
  products,
  meta,
  search,
  handleSearch,
  deleteProduct,
  deletingId,
  setPage
}: {
  products: { id: string; name: string; description: string; price: number; }[];
  meta: { currentPage: number; lastPage: number; } | null;
  search: string;
  handleSearch: (value: string) => void;
  deleteProduct: (id: string) => Promise<void>;
  deletingId: string | null;
  setPage: (page: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-[60px]">
        <div className="w-full max-w-[50%]">
          <Search value={search} onChange={handleSearch} />
        </div>
        <CreateProductContainer />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCardContainer
            key={product.id}
            product={product}
            onDelete={() => deleteProduct(product.id)}
            isDeleting={deletingId === product.id}
          />
        ))}
      </div>

      {meta && (
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.lastPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

import { Search } from "@/components/Search";
import { EmptyState } from "@/components/EmptyState";
import { CreateProductContainer } from "../../CreateProduct/CreateProductContainer";

export function EmptyProductList({ search, handleSearch }: { search: string; handleSearch: (value: string) => void; }) {
  return (
    <>
      <div className="flex justify-between items-center mb-[60px]">
        <div className="w-full max-w-[50%]">
          <Search value={search} onChange={handleSearch} />
        </div>
        <CreateProductContainer />
      </div>
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          title="No results, no worries!"
          description="Try tweaking your search or adding something new."
        />
      </div>
    </>
  );
}

import { useToast } from "@/hooks/use-toast";
import { CreateProductPresentational } from "./CreateProductPresentational";
import { useProducts } from "../../context/ProductsContext";

export function CreateProductContainer() {
  const {
    createProduct,
    loadingCreateProduct,
    product,
    setProduct,
    setProductDialogOpen,
    productDialogOpen
  } = useProducts(); 

  const { name, description, price } = product

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({ name, description, price }); 
  };

  return (
    <CreateProductPresentational
      name={name}  
      setName={(newName: string) => setProduct({ ...product, name: newName })}
      description={description}
      setDescription={(newDescription: string) => setProduct({ ...product, description: newDescription })}
      price={price}
      setPrice={(newPrice: number) => setProduct({ ...product, price: newPrice })}
      isLoading={loadingCreateProduct} 
      isOpen={productDialogOpen} 
      setIsOpen={setProductDialogOpen}  
      handleSubmit={handleSubmit}  
    />
  );
}


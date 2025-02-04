import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CreateProductPresentationalProps = {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: number;
  setPrice: (price: number) => void;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export function CreateProductPresentational({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  isLoading,
  isOpen,
  setIsOpen,
  handleSubmit,
}: CreateProductPresentationalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Add a new product to generate AI-powered suggestions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)} 
            placeholder="Product name"
            required
            disabled={isLoading}
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description"
            required
            disabled={isLoading}
          />
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            placeholder="Product price"
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

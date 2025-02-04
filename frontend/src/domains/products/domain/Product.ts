export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  aiSuggestions?: {
    features: string[];
    benefits: string[];
    targetAudience: string;
    other: Record<string, string>;
  };
  createdAt?: string;
  updatedAt?: string;
}

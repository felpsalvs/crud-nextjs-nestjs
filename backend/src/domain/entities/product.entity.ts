import { AIResponseData } from '../interfaces/ai-response.interface';

export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  aiSuggestions?: AIResponseData;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Partial<Product>) {
    Object.assign(this, props);
  }
}

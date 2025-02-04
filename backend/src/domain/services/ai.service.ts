import { AIResponseData } from '../interfaces/ai-response.interface';

export interface AIService {
  enrichProductInfo(productName: string): Promise<AIResponseData>;
}

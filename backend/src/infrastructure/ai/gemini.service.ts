import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AIService } from '../../domain/services/ai.service';
import { AIResponseData } from '../../domain/interfaces/ai-response.interface';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class GeminiService implements AIService {
  private model: GenerativeModel;

  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    const genAI = new GoogleGenerativeAI(
      this.configService.get<string>('NEXT_PUBLIC_GEMINI_API_KEY') || '',
    );
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  private getFallbackResponse(productName: string): AIResponseData {
    return {
      description: `Default description for ${productName}`,
      suggestedPrice: 99.99,
      additionalInfo: {
        features: ['Feature 1', 'Feature 2'],
        benefits: ['Benefit 1', 'Benefit 2'],
        targetAudience: 'General audience',
        other: {},
      },
    };
  }

  async enrichProductInfo(productName: string): Promise<AIResponseData> {
    const cacheKey = this.cacheService.generateKey(productName);

    // Tenta buscar do cache primeiro
    const cachedResponse = await this.cacheService.getAIResponse(cacheKey);
    if (cachedResponse) {
      console.log('Cache hit for product:', productName);
      return cachedResponse;
    }

    try {
      const prompt = `You are a product description generator. Create a JSON object for "${productName}" following exactly this structure, without any additional text or formatting:
{
  "description": "Write a concise and professional product description",
  "suggestedPrice": <number between 50 and 500>,
  "additionalInfo": {
    "features": ["List 2-3 key features"],
    "benefits": ["List 2-3 main benefits"],
    "targetAudience": "Describe the target audience",
    "other": {}
  }
}`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      try {
        // Remove qualquer texto antes ou depois do JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : '';

        if (!jsonString) {
          console.error('No valid JSON found in response');
          return this.getFallbackResponse(productName);
        }

        const parsed = JSON.parse(jsonString) as AIResponseData;

        if (!this.isValidAIResponse(parsed)) {
          console.error('Invalid AI response structure');
          return this.getFallbackResponse(productName);
        }

        // Salva no cache antes de retornar
        await this.cacheService.setAIResponse(cacheKey, {
          description: parsed.description.trim(),
          suggestedPrice: Number(parsed.suggestedPrice),
          additionalInfo: {
            features: parsed.additionalInfo.features.map((f) => f.trim()),
            benefits: parsed.additionalInfo.benefits.map((b) => b.trim()),
            targetAudience: parsed.additionalInfo.targetAudience.trim(),
            other: parsed.additionalInfo.other || {},
          },
        });
        return {
          description: parsed.description.trim(),
          suggestedPrice: Number(parsed.suggestedPrice),
          additionalInfo: {
            features: parsed.additionalInfo.features.map((f) => f.trim()),
            benefits: parsed.additionalInfo.benefits.map((b) => b.trim()),
            targetAudience: parsed.additionalInfo.targetAudience.trim(),
            other: parsed.additionalInfo.other || {},
          },
        };
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        return this.getFallbackResponse(productName);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.getFallbackResponse(productName);
    }
  }

  private isValidAIResponse(data: unknown): data is AIResponseData {
    try {
      const response = data as AIResponseData;
      return (
        typeof response === 'object' &&
        response !== null &&
        typeof response.description === 'string' &&
        (typeof response.suggestedPrice === 'number' ||
          !isNaN(Number(response.suggestedPrice))) &&
        typeof response.additionalInfo === 'object' &&
        Array.isArray(response.additionalInfo.features) &&
        Array.isArray(response.additionalInfo.benefits) &&
        typeof response.additionalInfo.targetAudience === 'string' &&
        typeof response.additionalInfo.other === 'object'
      );
    } catch {
      return false;
    }
  }
}

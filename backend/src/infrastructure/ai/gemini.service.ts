import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AIService } from '../../domain/services/ai.service';
import { AIResponseData } from '../../domain/interfaces/ai-response.interface';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class GeminiService implements AIService, OnModuleInit {
  private model: GenerativeModel;
  private readonly logger = new Logger(GeminiService.name);
  private readonly maxRetries = 3;

  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) { }

  async onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY not configured');
      throw new Error('GEMINI_API_KEY is required');
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    } catch (error) {
      this.logger.error('Failed to initialize Gemini API', error);
      throw error;
    }
  }

  private getFallbackResponse(productName: string): AIResponseData {
    this.logger.warn(`Using fallback response for: ${productName}`);
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

    try {
      const cachedResponse = await this.cacheService.getAIResponse(cacheKey);
      if (cachedResponse) {
        this.logger.debug(`Cache hit for product: ${productName}`);
        return cachedResponse;
      }

      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          const response = await this.generateContent(productName);
          const parsedResponse = await this.parseAndValidateResponse(response);

          if (parsedResponse) {
            await this.cacheService.setAIResponse(cacheKey, parsedResponse);
            return parsedResponse;
          }
        } catch (error) {
          this.logger.error(
            `Attempt ${attempt} failed for product: ${productName}`,
            error
          );
          if (attempt === this.maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }

      return this.getFallbackResponse(productName);
    } catch (error) {
      this.logger.error('Failed to enrich product info', error);
      return this.getFallbackResponse(productName);
    }
  }

  private async generateContent(productName: string): Promise<string> {
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
    return result.response.text();
  }

  private async parseAndValidateResponse(response: string): Promise<AIResponseData | null> {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '';

      if (!jsonString) {
        this.logger.warn('No valid JSON found in response');
        return null;
      }

      const parsed = JSON.parse(jsonString) as AIResponseData;

      if (!this.isValidAIResponse(parsed)) {
        this.logger.warn('Invalid AI response structure');
        return null;
      }

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
    } catch (error) {
      this.logger.error('Error parsing response', error);
      return null;
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
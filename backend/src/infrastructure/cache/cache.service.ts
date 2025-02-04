import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AIResponseData } from '../../domain/interfaces/ai-response.interface';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAIResponse(key: string): Promise<AIResponseData | null> {
    return await this.cacheManager.get<AIResponseData>(key);
  }

  async setAIResponse(key: string, value: AIResponseData): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  generateKey(productName: string): string {
    return `ai_response:${productName.toLowerCase().trim()}`;
  }
}
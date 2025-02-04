import { Product } from '../../domain/entities/product.entity';
import {
  ProductResponseDto,
  AIResponseDataDto,
} from '../../application/dtos/product.dto';

export class ProductMapper {
  static toDto(product: Product): ProductResponseDto {
    const defaultAiSuggestions: AIResponseDataDto = {
      description: '',
      suggestedPrice: 0,
      additionalInfo: {
        features: [],
        benefits: [],
        targetAudience: '',
        other: {},
      },
    };

    const aiSuggestions: AIResponseDataDto = product.aiSuggestions
      ? {
          description: product.aiSuggestions.description || '',
          suggestedPrice: product.aiSuggestions.suggestedPrice || 0,
          additionalInfo: {
            features: product.aiSuggestions.additionalInfo?.features || [],
            benefits: product.aiSuggestions.additionalInfo?.benefits || [],
            targetAudience:
              product.aiSuggestions.additionalInfo?.targetAudience || '',
            other: product.aiSuggestions.additionalInfo?.other || {},
          },
        }
      : defaultAiSuggestions;

    return {
      id: product.id!,
      name: product.name,
      description: product.description,
      price: product.price,
      aiSuggestions,
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date(),
    };
  }

  static toDtoList(products: Product[]): ProductResponseDto[] {
    return products.map(this.toDto);
  }
}

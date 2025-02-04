import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { AIService } from '../../domain/services/ai.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { Product } from '../../domain/entities/product.entity';
import { PaginationDto, PaginatedResponse } from '../../domain/dtos/pagination.dto';
import {
  PRODUCT_REPOSITORY,
  AI_SERVICE,
} from '../../domain/constants/injection-tokens';

@Injectable()
export class ProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(AI_SERVICE)
    private readonly aiService: AIService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const aiSuggestions = await this.aiService.enrichProductInfo(
      createProductDto.name,
    );

    const product = new Product({
      name: createProductDto.name,
      description: aiSuggestions.description,
      price: aiSuggestions.suggestedPrice,
      aiSuggestions: aiSuggestions,
    });

    return this.productRepository.create(product);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  findAll(pagination: PaginationDto): Promise<PaginatedResponse<Product>> {
    return this.productRepository.findAll(pagination);
  }

  update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productRepository.update(id, updateProductDto);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  findByName(name: string): Promise<Product[]> {
    return this.productRepository.findByName(name);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { PaginationDto, PaginatedResponse } from '../../domain/dtos/pagination.dto';
import { Prisma } from '@prisma/client';
import { PrismaProduct, ProductWhereInput } from '../database/prisma.types';
import { AIResponseData } from '../../domain/interfaces/ai-response.interface';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  private toEntity(prismaProduct: PrismaProduct): Product {
    return new Product({
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description,
      price: Number(prismaProduct.price),
      aiSuggestions: prismaProduct.aiSuggestions as unknown as AIResponseData,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
    });
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<Product>> {
    const { page = 1, limit = 10, search } = pagination;
    const skip = (page - 1) * limit;

    const where: ProductWhereInput | undefined = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        }
      : undefined;

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: products.map(this.toEntity),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async create(data: Partial<Product>): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        name: data.name!,
        description: data.description!,
        price: data.price!,
        aiSuggestions: data.aiSuggestions as unknown as Prisma.InputJsonValue,
      },
    });
    return this.toEntity(created);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        aiSuggestions: data.aiSuggestions
          ? (data.aiSuggestions as unknown as Prisma.InputJsonValue)
          : undefined,
      },
    });
    return this.toEntity(updated);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? this.toEntity(product) : null;
  }

  async findByName(name: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      },
    });
    return products.map(this.toEntity);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }
}
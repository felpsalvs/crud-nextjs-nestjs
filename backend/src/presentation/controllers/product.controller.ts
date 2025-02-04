import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductUseCase } from '../../application/use-cases/product.use-case';
import { CreateProductDto, ProductResponseDto } from '../../application/dtos/product.dto';
import { PaginationDto } from '../../domain/dtos/pagination.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) { }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const result = await this.productUseCase.findAll(pagination);
    return {
      items: result.data,
      meta: result.meta
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productUseCase.findById(id);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productUseCase.create(createProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.productUseCase.delete(id);
  }
}
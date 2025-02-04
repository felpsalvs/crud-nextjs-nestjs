import { Product } from '../entities/product.entity';
import { PaginationDto, PaginatedResponse } from '../dtos/pagination.dto';

export interface ProductRepository {
  create(product: Partial<Product>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product[]>;
  findAll(pagination: PaginationDto): Promise<PaginatedResponse<Product>>;
}

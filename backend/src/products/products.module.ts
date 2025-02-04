import { Module } from '@nestjs/common';
import { ProductController } from '../presentation/controllers/product.controller';
import { ProductUseCase } from '../application/use-cases/product.use-case';
import { PrismaProductRepository } from '../infrastructure/repositories/prisma-product.repository';
import { PRODUCT_REPOSITORY, AI_SERVICE } from '../domain/constants/injection-tokens';
import { PrismaModule } from '../infrastructure/database/prisma.module';
import { GeminiService } from '../infrastructure/ai/gemini.service';
import { RedisCacheModule } from '../infrastructure/cache/cache.module';

@Module({
  imports: [
    PrismaModule,
    RedisCacheModule
  ],
  controllers: [ProductController],
  providers: [
    ProductUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
    {
      provide: AI_SERVICE,
      useClass: GeminiService,
    }
  ],
})
export class ProductsModule {}

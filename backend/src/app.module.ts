import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductUseCase } from './application/use-cases/product.use-case';
import { PrismaService } from './infrastructure/database/prisma.service';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { GeminiService } from './infrastructure/ai/gemini.service';
import {
  PRODUCT_REPOSITORY,
  AI_SERVICE,
} from './domain/constants/injection-tokens';
import { ProductsModule } from './products/products.module';
import { RedisCacheModule } from './infrastructure/cache/cache.module';
import { PrismaModule } from './infrastructure/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisCacheModule,
    ProductsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ProductUseCase,
    PrismaService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
    {
      provide: AI_SERVICE,
      useClass: GeminiService,
    },
  ],
})
export class AppModule { }

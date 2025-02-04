import { Prisma } from '@prisma/client';
import { AIResponseData } from '../../domain/interfaces/ai-response.interface';

export type PrismaProduct = {
  id: string;
  name: string;
  description: string;
  price: Prisma.Decimal;
  aiSuggestions: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductWhereInput = {
  name?: {
    contains: string;
    mode: Prisma.QueryMode;
  };
};

export const prismaProductToEntity = (prismaProduct: PrismaProduct) => ({
  ...prismaProduct,
  price: Number(prismaProduct.price),
  aiSuggestions: prismaProduct.aiSuggestions as unknown as AIResponseData,
});

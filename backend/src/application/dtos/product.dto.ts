import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class AdditionalInfoDto {
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsArray()
  @IsString({ each: true })
  benefits: string[];

  @IsString()
  targetAudience: string;

  @IsObject()
  other: Record<string, string>;
}

export class AIResponseDataDto {
  @IsString()
  description: string;

  @IsNumber()
  suggestedPrice: number;

  @ValidateNested()
  @Type(() => AdditionalInfoDto)
  additionalInfo: AdditionalInfoDto;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;
}

export class ProductResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AIResponseDataDto)
  aiSuggestions: AIResponseDataDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

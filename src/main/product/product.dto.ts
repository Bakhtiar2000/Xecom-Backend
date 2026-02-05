import {
  IsString,
  IsOptional,
  IsUUID,
  Length,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { ProductStatus } from 'src/generated/prisma';

export class CreateProductDto {
  @IsString()
  @Length(2, 200)
  name: string;

  @IsString()
  @Length(2, 250)
  slug: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  dimensions?: any;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  metaKeywords?: string[];

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  specifications?: any; // JSON object

  @IsOptional()
  faqData?: any; // array of {question: string, answer: string} 

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  manualUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minOrderQty?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxOrderQty?: number;
}

export class UpdateProductDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 250)
  slug?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  dimensions?: any;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  metaKeywords?: string[];

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  specifications?: any;

  @IsOptional()
  faqData?: any;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  manualUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minOrderQty?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxOrderQty?: number;
}

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
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus, ProductWeightUnit, ProductDimensionUnit } from 'src/generated/prisma';

// ========================================
// NESTED DTOs for Images and Variants
// ========================================

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class CreateProductDimensionDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  length?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  width?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsEnum(ProductDimensionUnit)
  unit?: ProductDimensionUnit;
}

export class CreateProductFaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateProductVariantInProductDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockAlertThreshold?: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  attributeValueIds?: string[];
}

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
  @IsEnum(ProductWeightUnit)
  weightUnit?: ProductWeightUnit;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProductDimensionDto)
  dimension?: CreateProductDimensionDto;

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductFaqDto)
  faqs?: CreateProductFaqDto[];

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

  // Images and Variants
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantInProductDto)
  variants?: CreateProductVariantInProductDto[];
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
  @IsEnum(ProductWeightUnit)
  weightUnit?: ProductWeightUnit;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProductDimensionDto)
  dimension?: CreateProductDimensionDto;

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductFaqDto)
  faqs?: CreateProductFaqDto[];

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

  // Images and Variants
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantInProductDto)
  variants?: CreateProductVariantInProductDto[];
}

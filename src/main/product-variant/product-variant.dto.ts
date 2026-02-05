import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsArray,
  Min,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsUUID()
  productId: string;

  @IsString()
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
  attributeValueIds?: string[];
}

export class UpdateProductVariantDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockAlertThreshold?: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsArray()
  attributeValueIds?: string[];
}

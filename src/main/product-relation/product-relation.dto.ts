import {
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductRelationType } from 'src/generated/prisma';

export class CreateProductRelationDto {
  @IsUUID()
  productId!: string;

  @IsUUID()
  relatedToId!: string;

  @IsEnum(ProductRelationType)
  type!: ProductRelationType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;
}

export class CreateBulkProductRelationsDto {
  @IsUUID()
  productId!: string;

  @IsEnum(ProductRelationType)
  type!: ProductRelationType;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  relatedProductIds!: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;
}

export class UpdateProductRelationDto {
  @IsUUID()
  id!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;
}

export class ProductRelationQueryDto {
  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsEnum(ProductRelationType)
  type?: ProductRelationType;
}

import { IsString, IsOptional, IsInt, IsUUID, Length, IsArray, IsEnum } from 'class-validator';
import { TargetAudience } from 'src/generated/prisma';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(2, 150)
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(TargetAudience, { each: true })
  targetAudience?: TargetAudience[];
}

export class UpdateCategoryDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 150)
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

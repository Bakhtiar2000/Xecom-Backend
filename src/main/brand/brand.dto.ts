import { IsString, IsOptional, IsUUID, Length, IsUrl } from 'class-validator';

export class CreateBrandDto {
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
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}

export class UpdateBrandDto {
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
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}

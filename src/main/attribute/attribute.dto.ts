import { IsString, IsOptional, IsUUID, Length } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  @Length(2, 50)
  name: string;
}

export class UpdateAttributeDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;
}

export class CreateAttributeValueDto {
  @IsUUID()
  attributeId: string;

  @IsString()
  @Length(1, 100)
  value: string;

  @IsOptional()
  @IsString()
  hexCode?: string;
}

export class UpdateAttributeValueDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  value?: string;

  @IsOptional()
  @IsString()
  hexCode?: string;
}

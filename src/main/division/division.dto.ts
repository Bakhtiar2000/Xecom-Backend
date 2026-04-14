import { IsString, Length, IsUUID, IsOptional } from 'class-validator';

export class CreateDivisionDto {
    @IsString()
    @Length(2, 100)
    name!: string;

    @IsString()
    @IsUUID()
    countryId!: string;
}

export class UpdateDivisionDto {
    @IsUUID()
    id!: string;

    @IsString()
    @IsOptional()
    @Length(2, 100)
    name?: string;

    @IsString()
    @IsOptional()
    @IsUUID()
    countryId?: string;
}
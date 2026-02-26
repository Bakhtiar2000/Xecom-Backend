import { IsString, IsOptional, Length, IsUUID } from 'class-validator';

export class CreateCountryDto {
    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @IsOptional()
    @Length(2, 10)
    code?: string;
}

export class UpdateCountryDto {
    @IsUUID()
    id: string;

    @IsString()
    @IsOptional()
    @Length(2, 100)
    name?: string;

    @IsString()
    @IsOptional()
    @Length(2, 10)
    code?: string;
}
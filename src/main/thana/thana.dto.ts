import { IsString, Length, IsUUID, IsOptional } from 'class-validator';

export class CreateThanaDto {
    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @IsUUID()
    districtId: string;
}

export class UpdateThanaDto {
    @IsUUID()
    id: string;

    @IsString()
    @IsOptional()
    @Length(2, 100)
    name?: string;

    @IsString()
    @IsOptional()
    @IsUUID()
    districtId?: string;
}
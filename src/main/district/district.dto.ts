import { IsString, Length, IsUUID, IsOptional } from 'class-validator';

export class CreateDistrictDto {
    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @IsUUID()
    divisionId: string;
}

export class UpdateDistrictDto {
    @IsUUID()
    id: string;

    @IsString()
    @IsOptional()
    @Length(2, 100)
    name?: string;

    @IsString()
    @IsOptional()
    @IsUUID()
    divisionId?: string;
}
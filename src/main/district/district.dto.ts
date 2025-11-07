import { IsString, Length, IsUUID } from 'class-validator';

export class CreateDistrictDto {
    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @IsUUID()
    divisionId: string;
}
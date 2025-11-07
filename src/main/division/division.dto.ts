import { IsString, Length, IsUUID } from 'class-validator';

export class CreateDivisionDto {
    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @IsUUID()
    countryId: string;
}
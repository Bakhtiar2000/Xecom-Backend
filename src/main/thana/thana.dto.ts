import { IsString, Length, IsUUID } from 'class-validator';

export class CreateThanaDto {
    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @IsUUID()
    districtId: string;
}
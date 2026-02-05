import { Gender } from 'src/generated/prisma';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
}

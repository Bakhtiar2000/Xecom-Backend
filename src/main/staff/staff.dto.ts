import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Gender } from 'src/generated/prisma';

export class CreateStaffDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsString()
  hireDate: string;

  @IsString()
  notes: string;

  @IsOptional()
  @IsString()
  profilePicture: string;

  @IsString()
  thanaId: string;

  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  postalCode?: string;
}

import {
  IsString,
  IsEmail,
  Length,
  IsOptional,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Gender, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2, 50)
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  profile_photo?: string;

  @IsOptional()
  @IsInt()
  streetNumber: number;

  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsInt()
  postalCode: number;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  countryId: string;

  @IsOptional()
  @IsString()
  stateId: string;
}

export class changeUserStatus {
  @IsEnum(UserStatus)
  status: UserStatus;
}
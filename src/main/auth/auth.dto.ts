import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

// login
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ChangePasswordDto {
  @IsString()
  password: string;

  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number.',
  })
  newPassword: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number.',
  })
  newPassword: string;
}

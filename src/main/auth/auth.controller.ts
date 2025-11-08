import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Patch,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import {
  LoginDto,
  ForgotPasswordDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from './auth.dto';
import sendResponse from 'src/utils/sendResponse';
import { AuthGuard } from 'src/guard/auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.loginUser(loginDto);
    const { refreshToken, accessToken } = result;
    res.cookie('refreshToken', refreshToken, {
      secure: this.configService.get('NODE_ENV') === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Logged in successfully',
      data: { accessToken },
    });
  }

  // Change Password
  @Patch('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Res() res: Response,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const result = await this.authService.changePassword(
      req.user,
      changePasswordDto,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Password changed successfully',
      data: result,
    });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Res() res: Response,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const result = await this.authService.forgotPassword(
      forgotPasswordDto.email,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Please check your mail!',
      data: result,
    });
  }

  @Patch('reset-password')
  async resetPassword(
    @Res() res: Response,
    @Req() req: Request,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const token = req.headers.authorization as string;
    const result = await this.authService.resetPassword(
      resetPasswordDto,
      token,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Password has been reset successfully!',
      data: result,
    });
  }
}

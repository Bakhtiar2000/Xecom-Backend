import { Controller, Get, Post, Body, Patch, Param, UseGuards, Res, Req, HttpStatus, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ChangeUserStatusDto } from './user.dto';
import sendResponse from 'src/utils/sendResponse';
import { AuthGuard } from 'src/guard/auth.guard';
import type { Request, Response } from 'express';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { UploadInterceptor } from 'src/common/upload.interceptor';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LibService } from 'src/lib/lib.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly lib: LibService,
  ) {}

  // Get me
  @Get('me')
  @UseGuards(AuthGuard)
  async getUser(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.getMe(req.user);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User profile fetched Successfully',
      data: result,
    });
  }

  // Get all users
  @Get()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN]))
  async getAllUsers(@Res() res: Response) {
    const result = await this.userService.getAllUsers();
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'All Users fetched Successfully',
      data: result,
    });
  }
  // Change User Status
  @Patch('change-status/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN]))
  async changeUserStatus(
    @Param() param: IdDto,
    @Res() res: Response,
    @Body() changeUserStatusDto: ChangeUserStatusDto,
  ) {
    const result = await this.userService.changeUserStatus(
      param.id,
      changeUserStatusDto.status,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User status updated successfully',
      data: result,
    });
  }
}

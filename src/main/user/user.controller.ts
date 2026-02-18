import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Res,
  Req,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ChangeUserStatusDto } from './user.dto';
import sendResponse from 'src/utils/sendResponse';
import { AuthGuard } from 'src/guard/auth.guard';
import type { Request, Response } from 'express';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from 'src/generated/prisma';
import { IdDto } from 'src/common/id.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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
  async getAllUsers(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('fields') fields: string,
    @Query('gender') gender: string,
    @Query('role') role: string,
    @Query('emailVerified') emailVerified: string,
    @Query('status') status: string,
    @Query('searchTerm') searchTerm: string,
    @Res() res: Response,
  ) {
    const page = parseInt(pageNumber) || 1;
    const size = parseInt(pageSize) || 20;

    const result = await this.userService.getAllUsers(
      page,
      size,
      sortBy,
      sortOrder as 'asc' | 'desc',
      fields,
      gender,
      role,
      emailVerified,
      status,
      searchTerm,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'All Users fetched Successfully',
      meta: result.meta,
      data: result.data,
    });
  }

  // Get users metadata
  @Get('metadata')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async getUsersMetadata(@Res() res: Response) {
    const result = await this.userService.getUsersMetadata();
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Users metadata fetched successfully',
      data: result,
    });
  }

  // Change User Status
  @Patch('change-status/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
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

import { Controller, Get, Post, Body, Patch, Param, UseGuards, Res, Req, HttpStatus, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
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

  // Create user (Server/ Developer)
  @Post('register')
  @UploadInterceptor('file')
  async registerUser(
    @Body('text') text: string, // this is the JSON string from "text"
    @UploadedFile() file: any,
    @Res() res: Response,
  ) {
    // Parse text and transform to DTO instance
    const parsed = JSON.parse(text);
    const createUserDto = plainToInstance(CreateUserDto, parsed);

    // If file is uploaded, attach URL
    if (file) {
      const uploaded = await this.lib.uploadToCloudinary({
        fileName: file.filename,
        path: file.path,
      });
      if (uploaded?.secure_url) {
        createUserDto.profile_photo = uploaded.secure_url;
      }
    }

    // Validate the parsed DTO manually
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          Object.values(errors[0].constraints || {})[0] || 'Validation failed',
        errorDetails: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    }
    const result = await this.userService.registerUser(createUserDto);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Please check your email to verify your account!',
      data: result,
    });
  }
}

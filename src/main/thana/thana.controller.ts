import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ThanaService } from './thana.service';
import { CreateThanaDto } from './thana.dto';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@Controller('thana')
export class ThanaController {
    constructor(
        private readonly thanaService: ThanaService,
    ) { }

    // Add Thana
    @Post()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
    async addThana(
        @Body() dto: CreateThanaDto,
        @Res() res: Response,
    ) {
        const result = await this.thanaService.addThana(dto);
        sendResponse(res, {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: 'Thana created successfully',
            data: result,
        });
    }
}
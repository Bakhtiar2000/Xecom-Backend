import { Controller, Get, Post, Body, Param, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { DivisionService } from './division.service';
import { CreateDivisionDto } from './division.dto';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { IdDto } from 'src/common/id.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@Controller('division')
export class DivisionController {
    constructor(
        private readonly divisionService: DivisionService,
    ) { }

    // Add Division
    @Post()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
    async addDivision(
        @Body() dto: CreateDivisionDto,
        @Res() res: Response,
    ) {
        const result = await this.divisionService.addDivision(dto);
        sendResponse(res, {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: 'Division created successfully',
            data: result,
        });
    }

    // Get Single Division
    @Get(':id')
    async getSingleDivision(
        @Param() param: IdDto,
        @Res() res: Response,
    ) {
        const result = await this.divisionService.getSingleDivision(param.id);
        sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'Division fetched successfully',
            data: result,
        });
    }
}
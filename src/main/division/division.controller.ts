import { Controller, Get, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { DivisionService } from './division.service';
import { CreateDivisionDto } from './division.dto';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { IdDto } from 'src/common/id.dto';

@Controller('division')
export class DivisionController {
    constructor(
        private readonly divisionService: DivisionService,
    ) { }

    // Add Division
    @Post()
    async addDivision(
        @Body() createDivisionDto: CreateDivisionDto,
        @Res() res: Response,
    ) {
        const result = await this.divisionService.addDivision(createDivisionDto);
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
import { Controller, Get, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './district.dto';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { IdDto } from 'src/common/id.dto';

@Controller('district')
export class DistrictController {
    constructor(
        private readonly districtService: DistrictService,
    ) { }

    // Add District
    @Post()
    async addDistrict(
        @Body() createDistrictDto: CreateDistrictDto,
        @Res() res: Response,
    ) {
        const result = await this.districtService.addDistrict(createDistrictDto);
        sendResponse(res, {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: 'District created successfully',
            data: result,
        });
    }

    // Get Single District
    @Get(':id')
    async getSingleDistrict(
        @Param() param: IdDto,
        @Res() res: Response,
    ) {
        const result = await this.districtService.getSingleDistrict(param.id);
        sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'District fetched successfully',
            data: result,
        });
    }
}
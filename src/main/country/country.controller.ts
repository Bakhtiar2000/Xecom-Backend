import { Controller, Get, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './country.dto';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { IdDto } from 'src/common/id.dto';

@Controller('country')
export class CountryController {
    constructor(
        private readonly countryService: CountryService,
    ) { }

    // Add Country
    @Post()
    async addCountry(
        @Body() createCountryDto: CreateCountryDto,
        @Res() res: Response,
    ) {
        const result = await this.countryService.addCountry(createCountryDto);
        sendResponse(res, {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: 'Country created successfully',
            data: result,
        });
    }

    // Get All Countries
    @Get()
    async getAllCountries(@Res() res: Response) {
        const result = await this.countryService.getAllCountries();
        sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'Countries fetched successfully',
            data: result,
        });
    }

    // Get Single Country
    @Get(':id')
    async getSingleCountry(
        @Param() param: IdDto,
        @Res() res: Response,
    ) {
        const result = await this.countryService.getSingleCountry(param.id);
        sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'Country fetched successfully',
            data: result,
        });
    }
}
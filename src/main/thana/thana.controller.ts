import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ThanaService } from './thana.service';
import { CreateThanaDto } from './thana.dto';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';

@Controller('thana')
export class ThanaController {
    constructor(
        private readonly thanaService: ThanaService,
    ) { }

    // Add Thana
    @Post()
    async addThana(
        @Body() createThanaDto: CreateThanaDto,
        @Res() res: Response,
    ) {
        const result = await this.thanaService.addThana(createThanaDto);
        sendResponse(res, {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: 'Thana created successfully',
            data: result,
        });
    }
}
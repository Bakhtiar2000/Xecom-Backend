import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from 'src/guard/auth.guard';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { UploadInterceptor } from 'src/common/upload.interceptor';
import { plainToInstance } from 'class-transformer';
import { LibService } from 'src/lib/lib.service';
import { validate } from 'class-validator';
import { CreateCustomerDto } from './customer.dto';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@Controller('customer')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService,
        private readonly lib: LibService,
    ) { }

    // Get all customers
    @Get()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
    async getAllCustomers(@Res() res: Response) {
        const result = await this.customerService.getAllCustomers();
        sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'All Customer profiles fetched Successfully',
            data: result,
        });
    }

    // Add a customer
    @Post('register')
    async registerCustomer(@Res() res: Response, @Body() dto: CreateCustomerDto) {
        const result = await this.customerService.addCustomer(dto);
        sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'Customer added successfully!',
            data: result,
        });
    }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './district.dto';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { IdDto } from 'src/common/id.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from 'src/generated/prisma';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) { }

  // Add District
  @Post()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
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

  // Get All Districts
  @Get()
  async getAllDistricts(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('searchTerm') searchTerm: string,
    @Query('countryId') countryId: string,
    @Query('divisionId') divisionId: string,
    @Res() res: Response,
  ) {
    const page = parseInt(pageNumber) || 1;
    const size = parseInt(pageSize) || 20;

    const result = await this.districtService.getAllDistricts(
      page,
      size,
      sortBy,
      sortOrder as 'asc' | 'desc',
      searchTerm,
      countryId,
      divisionId,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Districts fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }

  // Get Single District
  @Get(':id')
  async getSingleDistrict(@Param() param: IdDto, @Res() res: Response) {
    const result = await this.districtService.getSingleDistrict(param.id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'District fetched successfully',
      data: result,
    });
  }
}

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductRelationService } from './product-relation.service';
import { AuthGuard } from 'src/guard/auth.guard';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateProductRelationDto,
  CreateBulkProductRelationsDto,
  UpdateProductRelationDto,
} from './product-relation.dto';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole, ProductRelationType } from 'src/generated/prisma';
import { IdDto } from 'src/common/id.dto';

@Controller('product')
export class ProductRelationController {
  constructor(
    private readonly productRelationService: ProductRelationService,
  ) {}

  // Get product relations
  @Get(':id/relations')
  async getProductRelations(
    @Param() params: IdDto,
    @Query('type') type: ProductRelationType,
    @Res() res: Response,
  ) {
    const result = await this.productRelationService.getRelations(
      params.id,
      type,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Product relations fetched successfully',
      data: result,
    });
  }

  // Add single product relation
  @Post('relations')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async addProductRelation(@Body() body: any, @Res() res: Response) {
    const dto = plainToInstance(CreateProductRelationDto, body);

    const errors = await validate(dto);
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

    const result = await this.productRelationService.addRelation(dto);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Product relation created successfully',
      data: result,
    });
  }

  // Add bulk product relations
  @Post('relations/bulk')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async addBulkProductRelations(@Body() body: any, @Res() res: Response) {
    const dto = plainToInstance(CreateBulkProductRelationsDto, body);

    const errors = await validate(dto);
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

    const result = await this.productRelationService.addBulkRelations(dto);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Product relations created successfully',
      data: result,
    });
  }

  // Update product relation
  @Put('relations/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async updateProductRelation(
    @Param() params: IdDto,
    @Body() body: any,
    @Res() res: Response,
  ) {
    body.id = params.id;
    const dto = plainToInstance(UpdateProductRelationDto, body);

    const errors = await validate(dto);
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

    const result = await this.productRelationService.updateRelation(dto);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Product relation updated successfully',
      data: result,
    });
  }

  // Delete product relation
  @Delete('relations/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async deleteProductRelation(@Param() params: IdDto, @Res() res: Response) {
    const result = await this.productRelationService.deleteRelation(params.id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Product relation deleted successfully',
      data: result,
    });
  }

  // Delete all product relations
  @Delete(':id/relations')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async deleteAllProductRelations(
    @Param() params: IdDto,
    @Query('type') type: ProductRelationType,
    @Res() res: Response,
  ) {
    const result = await this.productRelationService.deleteAllRelations(
      params.id,
      type,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Product relations deleted successfully',
      data: result,
    });
  }
}

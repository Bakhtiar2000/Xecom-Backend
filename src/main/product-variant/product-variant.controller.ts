import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Delete,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { AuthGuard } from 'src/guard/auth.guard';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from './product-variant.dto';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from 'src/generated/prisma';
import { IdDto } from 'src/common/id.dto';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  // Get all product variants of a product
  @Get('product/:id')
  async getAllProductVariantsByProductId(
    @Param() params: IdDto,
    @Res() res: Response,
  ) {
    const result =
      await this.productVariantService.getAllProductVariantsByProductId(
        params.id,
      );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Product variants fetched successfully',
      data: result,
    });
  }

  // Add a Product Variant
  @Post()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async addProductVariant(@Body() body: any, @Res() res: Response) {
    const createProductVariantDto = plainToInstance(
      CreateProductVariantDto,
      body,
    );

    // Validate the DTO
    const errors = await validate(createProductVariantDto);
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

    const result = await this.productVariantService.addProductVariant(
      createProductVariantDto,
    );
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Product variant created successfully',
      data: result,
    });
  }

  // Update a Product Variant
  @Put(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async updateProductVariant(
    @Param() params: IdDto,
    @Body() body: any,
    @Res() res: Response,
  ) {
    // Validate that ID in body matches ID in URL if provided
    if (body.id && body.id !== params.id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'ID in request body does not match ID in URL',
      });
    }

    body.id = params.id;
    const updateProductVariantDto = plainToInstance(
      UpdateProductVariantDto,
      body,
    );

    // Validate the DTO
    const errors = await validate(updateProductVariantDto);
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

    const result = await this.productVariantService.updateProductVariant(
      updateProductVariantDto,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Product variant updated successfully',
      data: result,
    });
  }

  // Delete a Product Variant
  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async deleteProductVariant(@Param() params: IdDto, @Res() res: Response) {
    const result = await this.productVariantService.deleteProductVariant(
      params.id,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Product variant deleted successfully',
      data: result,
    });
  }
}

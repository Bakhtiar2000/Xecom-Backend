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
import { AttributeService } from './attribute.service';
import { AuthGuard } from 'src/guard/auth.guard';
import sendResponse from 'src/utils/sendResponse';
import type { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateAttributeDto,
  UpdateAttributeDto,
  CreateAttributeValueDto,
  UpdateAttributeValueDto,
} from './attribute.dto';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from 'src/generated/prisma';
import { IdDto } from 'src/common/id.dto';

@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  // Get all attributes
  @Get()
  async getAllAttributes(@Res() res: Response) {
    const result = await this.attributeService.getAllAttributes();
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Attributes fetched successfully',
      data: result,
    });
  }

  // Get single attribute
  @Get(':id')
  async getSingleAttribute(@Param() params: IdDto, @Res() res: Response) {
    const result = await this.attributeService.getSingleAttribute(params.id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Attribute fetched successfully',
      data: result,
    });
  }

  // Add an Attribute
  @Post()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async addAttribute(@Body() body: any, @Res() res: Response) {
    const createAttributeDto = plainToInstance(CreateAttributeDto, body);

    // Validate the DTO
    const errors = await validate(createAttributeDto);
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

    const result = await this.attributeService.addAttribute(createAttributeDto);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Attribute created successfully',
      data: result,
    });
  }

  // Add an Attribute Value
  @Post('attribute-value')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async addAttributeValue(@Body() body: any, @Res() res: Response) {
    const createAttributeValueDto = plainToInstance(
      CreateAttributeValueDto,
      body,
    );

    // Validate the DTO
    const errors = await validate(createAttributeValueDto);
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

    const result = await this.attributeService.addAttributeValue(
      createAttributeValueDto,
    );
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Attribute value created successfully',
      data: result,
    });
  }

  // Update an Attribute
  @Put(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async updateAttribute(
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
    const updateAttributeDto = plainToInstance(UpdateAttributeDto, body);

    // Validate the DTO
    const errors = await validate(updateAttributeDto);
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

    const result =
      await this.attributeService.updateAttribute(updateAttributeDto);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Attribute updated successfully',
      data: result,
    });
  }

  // Update an Attribute Value
  @Put('attribute-value/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async updateAttributeValue(
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
    const updateAttributeValueDto = plainToInstance(
      UpdateAttributeValueDto,
      body,
    );

    // Validate the DTO
    const errors = await validate(updateAttributeValueDto);
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

    const result = await this.attributeService.updateAttributeValue(
      updateAttributeValueDto,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Attribute value updated successfully',
      data: result,
    });
  }

  // Delete an Attribute
  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async deleteAttribute(@Param() params: IdDto, @Res() res: Response) {
    const result = await this.attributeService.deleteAttribute(params.id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Attribute deleted successfully',
      data: result,
    });
  }

  // Delete an Attribute Value
  @Delete('attribute-value/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async deleteAttributeValue(@Param() params: IdDto, @Res() res: Response) {
    const result = await this.attributeService.deleteAttributeValue(params.id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Attribute value deleted successfully',
      data: result,
    });
  }
}

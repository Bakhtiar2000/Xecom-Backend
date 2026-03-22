import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from 'src/guard/auth.guard';
import sendResponse from 'src/utils/sendResponse';
import type { Request, Response } from 'express';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ApproveReviewDto,
} from './review.dto';
import { IdDto } from 'src/common/id.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Get my reviews
  @Get('my-reviews')
  @UseGuards(AuthGuard)
  async getMyReviews(
    @Req() req: Request,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('fields') fields: string,
    @Query('searchTerm') searchTerm: string,
    @Query('ratingValue') ratingValue: string,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const page = parseInt(pageNumber) || 1;
    const size = parseInt(pageSize) || 20;

    const result = await this.reviewService.getMyReviews(
      userId,
      page,
      size,
      sortBy,
      sortOrder as 'asc' | 'desc',
      fields,
      searchTerm,
      ratingValue,
    );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'My reviews fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }

  // Get all reviews of a product
  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('fields') fields: string,
    @Query('searchTerm') searchTerm: string,
    @Query('ratingValue') ratingValue: string,
    @Res() res: Response,
  ) {
    const page = parseInt(pageNumber) || 1;
    const size = parseInt(pageSize) || 20;

    const result = await this.reviewService.getProductReviews(
      productId,
      page,
      size,
      sortBy,
      sortOrder as 'asc' | 'desc',
      fields,
      searchTerm,
      ratingValue,
    );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Product reviews fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }

  // Add review
  @Post()
  @UseGuards(AuthGuard)
  async addReview(
    @Req() req: Request,
    @Body() createReviewDto: CreateReviewDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.reviewService.addReview(userId, createReviewDto);

    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Review added successfully',
      data: result,
    });
  }

  // Update review
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateReview(
    @Req() req: Request,
    @Param() params: IdDto,
    @Body() updateReviewDto: UpdateReviewDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;

    // Ensure the ID in the URL matches the ID in the body
    updateReviewDto.id = params.id;

    const result = await this.reviewService.updateReview(
      userId,
      updateReviewDto,
    );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Review updated successfully',
      data: result,
    });
  }

  // Delete review
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteReview(
    @Req() req: Request,
    @Param() params: IdDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.reviewService.deleteReview(userId, params.id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  }

  // Approve/Unapprove review
  @Patch(':id/approve')
  @UseGuards(AuthGuard)
  async approveReview(
    @Param() params: IdDto,
    @Body() approveReviewDto: ApproveReviewDto,
    @Res() res: Response,
  ) {
    const result = await this.reviewService.approveReview(
      params.id,
      approveReviewDto.isApproved,
    );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  }
}

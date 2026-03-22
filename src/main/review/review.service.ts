import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto, UpdateReviewDto } from './review.dto';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  // ------------------------------- Get My Reviews -------------------------------
  public async getMyReviews(
    userId: string,
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    fields?: string,
    searchTerm?: string,
    ratingValue?: string,
  ) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    // Parse fields string into array
    const selectedFields = fields
      ? fields.split(',').map((field) => field.trim())
      : undefined;

    // Get customer from userId
    const customer = await this.reviewRepository.getCustomerByUserId(userId);
    const customerId = customer.id;

    const [reviews, total] = await Promise.all([
      this.reviewRepository.findMyReviews(
        customerId,
        skip,
        take,
        sortBy,
        sortOrder,
        selectedFields,
        searchTerm,
        ratingValue,
      ),
      this.reviewRepository.countMyReviews(customerId, searchTerm, ratingValue),
    ]);

    return {
      data: reviews,
      meta: {
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalCount: total,
      },
    };
  }

  // ------------------------------- Get Product Reviews -------------------------------
  public async getProductReviews(
    productId: string,
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    fields?: string,
    searchTerm?: string,
    ratingValue?: string,
  ) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    // Parse fields string into array
    const selectedFields = fields
      ? fields.split(',').map((field) => field.trim())
      : undefined;

    const [reviews, total] = await Promise.all([
      this.reviewRepository.findProductReviews(
        productId,
        skip,
        take,
        sortBy,
        sortOrder,
        selectedFields,
        searchTerm,
        ratingValue,
      ),
      this.reviewRepository.countProductReviews(
        productId,
        searchTerm,
        ratingValue,
      ),
    ]);

    return {
      data: reviews,
      meta: {
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalCount: total,
      },
    };
  }

  // ------------------------------- Add Review -------------------------------
  public async addReview(userId: string, createReviewDto: CreateReviewDto) {
    // Get customer from userId
    const customer = await this.reviewRepository.getCustomerByUserId(userId);
    const customerId = customer.id;
    const { productId, rating, comment } = createReviewDto;

    // Check if customer already reviewed this product
    const existingReview = await this.reviewRepository.findByCustomerAndProduct(
      customerId,
      productId,
    );

    if (existingReview) {
      throw new HttpException(
        'You have already reviewed this product',
        HttpStatus.CONFLICT,
      );
    }

    const review = await this.reviewRepository.create(
      customerId,
      productId,
      rating,
      comment,
    );

    return review;
  }

  // ------------------------------- Update Review -------------------------------
  public async updateReview(userId: string, updateReviewDto: UpdateReviewDto) {
    const { id, rating, comment } = updateReviewDto;

    // Get customer from userId
    const customer = await this.reviewRepository.getCustomerByUserId(userId);
    const customerId = customer.id;

    // Check if review exists
    const existingReview = await this.reviewRepository.findById(id);

    if (!existingReview) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }

    // Verify the review belongs to the customer
    if (existingReview.customerId !== customerId) {
      throw new HttpException(
        'Unauthorized to update this review',
        HttpStatus.FORBIDDEN,
      );
    }

    const review = await this.reviewRepository.update(id, rating, comment);

    return review;
  }

  // ------------------------------- Delete Review -------------------------------
  public async deleteReview(userId: string, reviewId: string) {
    // Get customer from userId
    const customer = await this.reviewRepository.getCustomerByUserId(userId);
    const customerId = customer.id;
    // Check if review exists
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }

    // Verify the review belongs to the customer
    if (review.customerId !== customerId) {
      throw new HttpException(
        'Unauthorized to delete this review',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.reviewRepository.delete(reviewId);
    return { message: 'Review deleted successfully' };
  }

  // ------------------------------- Approve/Unapprove Review -------------------------------
  public async approveReview(reviewId: string, isApproved: boolean) {
    // Check if review exists
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }

    // Update review approval status
    await this.reviewRepository.approve(reviewId, isApproved);

    // Recalculate and update product review stats
    const stats = await this.reviewRepository.getProductReviewStats(
      review.productId,
    );

    await this.reviewRepository.updateProductReviewStats(
      review.productId,
      stats.avgRating,
      stats.reviewCount,
    );

    return {
      message: `Review ${isApproved ? 'approved' : 'unapproved'} successfully`,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class ReviewRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(
        customerId: string,
        productId: string,
        rating: number,
        comment?: string,
    ) {
        return this.prisma.review.create({
            data: {
                customerId,
                productId,
                rating,
                comment,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findMyReviews(
        customerId: string,
        skip: number,
        take: number,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc',
        fields?: string[],
        searchTerm?: string,
        ratingValue?: string,
    ) {
        // Build where clause
        const where: Prisma.ReviewWhereInput = {
            customerId,
        };

        if (searchTerm) {
            where.OR = [
                { comment: { contains: searchTerm, mode: 'insensitive' } },
                { product: { name: { contains: searchTerm, mode: 'insensitive' } } },
            ];
        }

        if (ratingValue) {
            where.rating = parseInt(ratingValue);
        }

        // Build orderBy object
        const orderBy: Prisma.ReviewOrderByWithRelationInput = sortBy
            ? ({ [sortBy]: sortOrder || 'desc' } as Prisma.ReviewOrderByWithRelationInput)
            : { createdAt: 'desc' as Prisma.SortOrder };

        // Build select object if fields are specified
        const select = fields && fields.length > 0
            ? (fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}) as Prisma.ReviewSelect)
            : undefined;

        const query: any = {
            where,
            skip,
            take,
            orderBy,
        };

        if (select) {
            query.select = select;
        } else {
            query.include = {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        images: {
                            where: { isFeatured: true },
                            take: 1,
                        },
                    },
                },
            };
        }

        return this.prisma.review.findMany(query);
    }

    async countMyReviews(
        customerId: string,
        searchTerm?: string,
        ratingValue?: string,
    ) {
        const where: Prisma.ReviewWhereInput = {
            customerId,
        };

        if (searchTerm) {
            where.OR = [
                { comment: { contains: searchTerm, mode: 'insensitive' } },
                { product: { name: { contains: searchTerm, mode: 'insensitive' } } },
            ];
        }

        if (ratingValue) {
            where.rating = parseInt(ratingValue);
        }

        return this.prisma.review.count({ where });
    }

    async findProductReviews(
        productId: string,
        skip: number,
        take: number,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc',
        fields?: string[],
        searchTerm?: string,
        ratingValue?: string,
    ) {
        // Build where clause
        const where: Prisma.ReviewWhereInput = {
            productId,
            isApproved: true, // Only show approved reviews
        };

        if (searchTerm) {
            where.comment = { contains: searchTerm, mode: 'insensitive' };
        }

        if (ratingValue) {
            where.rating = parseInt(ratingValue);
        }

        // Build orderBy object
        const orderBy: Prisma.ReviewOrderByWithRelationInput = sortBy
            ? ({ [sortBy]: sortOrder || 'desc' } as Prisma.ReviewOrderByWithRelationInput)
            : { createdAt: 'desc' as Prisma.SortOrder };

        // Build select object if fields are specified
        const select = fields && fields.length > 0
            ? (fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}) as Prisma.ReviewSelect)
            : undefined;

        const query: any = {
            where,
            skip,
            take,
            orderBy,
        };

        if (select) {
            query.select = select;
        } else {
            query.include = {
                customer: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            };
        }

        return this.prisma.review.findMany(query);
    }

    async countProductReviews(
        productId: string,
        searchTerm?: string,
        ratingValue?: string,
    ) {
        const where: Prisma.ReviewWhereInput = {
            productId,
            isApproved: true,
        };

        if (searchTerm) {
            where.comment = { contains: searchTerm, mode: 'insensitive' };
        }

        if (ratingValue) {
            where.rating = parseInt(ratingValue);
        }

        return this.prisma.review.count({ where });
    }

    async findById(id: string) {
        return this.prisma.review.findUnique({
            where: { id },
        });
    }

    async update(id: string, rating?: number, comment?: string) {
        const data: Prisma.ReviewUpdateInput = {};

        if (rating !== undefined) {
            data.rating = rating;
        }

        if (comment !== undefined) {
            data.comment = comment;
        }

        return this.prisma.review.update({
            where: { id },
            data,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async delete(id: string) {
        return this.prisma.review.delete({
            where: { id },
        });
    }

    async findByCustomerAndProduct(customerId: string, productId: string) {
        return this.prisma.review.findFirst({
            where: {
                customerId,
                productId,
            },
        });
    }

    async approve(id: string, isApproved: boolean) {
        return this.prisma.review.update({
            where: { id },
            data: { isApproved },
        });
    }

    async getProductReviewStats(productId: string) {
        const stats = await this.prisma.review.aggregate({
            where: {
                productId,
                isApproved: true,
            },
            _avg: {
                rating: true,
            },
            _count: {
                id: true,
            },
        });

        return {
            avgRating: stats._avg.rating,
            reviewCount: stats._count.id,
        };
    }

    async updateProductReviewStats(
        productId: string,
        avgRating: number | null,
        reviewCount: number,
    ) {
        return this.prisma.product.update({
            where: { id: productId },
            data: {
                avgRating,
                reviewCount,
            },
        });
    }
}

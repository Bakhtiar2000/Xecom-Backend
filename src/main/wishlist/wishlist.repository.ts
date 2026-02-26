import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WishlistRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, productId: string) {
        return this.prisma.wishlist.create({
            data: {
                userId,
                productId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        brand: true,
                        category: true,
                        images: {
                            where: { isFeatured: true },
                            take: 1,
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByUserAndProduct(userId: string, productId: string) {
        return this.prisma.wishlist.findFirst({
            where: {
                userId,
                productId,
            },
        });
    }

    async findById(id: string) {
        return this.prisma.wishlist.findUnique({
            where: { id },
        });
    }

    async delete(id: string) {
        return this.prisma.wishlist.delete({
            where: { id },
        });
    }

    async count(userId: string) {
        return this.prisma.wishlist.count({
            where: { userId },
        });
    }
}

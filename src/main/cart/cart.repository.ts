import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findOrCreateCart(customerId: string) {
        let cart = await this.prisma.cart.findFirst({
            where: { customerId },
            include: {
                items: {
                    include: {
                        variant: {
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
                                attributes: {
                                    include: {
                                        attributeValue: {
                                            include: {
                                                attribute: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { customerId },
                include: {
                    items: {
                        include: {
                            variant: {
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
                                    attributes: {
                                        include: {
                                            attributeValue: {
                                                include: {
                                                    attribute: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        }

        return cart;
    }

    async findCartItem(cartId: string, variantId: string) {
        return this.prisma.cartItem.findFirst({
            where: {
                cartId,
                variantId,
            },
        });
    }

    async addCartItem(cartId: string, variantId: string, quantity: number) {
        return this.prisma.cartItem.create({
            data: {
                cartId,
                variantId,
                quantity,
            },
            include: {
                variant: {
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
                        attributes: {
                            include: {
                                attributeValue: {
                                    include: {
                                        attribute: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async updateCartItemQuantity(cartItemId: string, quantity: number) {
        return this.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
            include: {
                variant: {
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
                        attributes: {
                            include: {
                                attributeValue: {
                                    include: {
                                        attribute: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async deleteCartItem(cartItemId: string) {
        return this.prisma.cartItem.delete({
            where: { id: cartItemId },
        });
    }

    async findCartItemById(cartItemId: string) {
        return this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                cart: true,
            },
        });
    }

    async findVariantById(variantId: string) {
        return this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
    }
}

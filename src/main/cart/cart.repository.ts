import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerByUserId(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new Error('Customer not found. Please complete your profile.');
    }

    return customer;
  }

  async findOrCreateCart(userId: string) {
    // First, get the customer
    const customer = await this.getCustomerByUserId(userId);

    let cart = await this.prisma.cart.findFirst({
      where: { customerId: customer.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
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
        data: { customerId: customer.id },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
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
    });
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
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

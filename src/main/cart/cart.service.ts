import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { AddToCartDto, UpdateCartItemDto } from './cart.dto';

@Injectable()
export class CartService {
    constructor(private readonly cartRepository: CartRepository) { }

    // ------------------------------- Get All Cart Items -------------------------------
    public async getAllCartItems(customerId: string) {
        const cart = await this.cartRepository.findOrCreateCart(customerId);
        return cart;
    }

    // ------------------------------- Add to Cart -------------------------------
    public async addToCart(customerId: string, addToCartDto: AddToCartDto) {
        const { variantId, quantity } = addToCartDto;

        // Check if variant exists
        const variant = await this.cartRepository.findVariantById(variantId);

        if (!variant) {
            throw new HttpException('Product variant not found', HttpStatus.NOT_FOUND);
        }

        // Check if variant has enough stock
        if (variant.stockQuantity < quantity) {
            throw new HttpException(
                `Insufficient stock. Only ${variant.stockQuantity} items available`,
                HttpStatus.BAD_REQUEST,
            );
        }

        // Get or create cart
        const cart = await this.cartRepository.findOrCreateCart(customerId);

        // Check if item already exists in cart
        const existingCartItem = await this.cartRepository.findCartItem(
            cart.id,
            variantId,
        );

        if (existingCartItem) {
            // Update quantity if item already exists
            const newQuantity = existingCartItem.quantity + quantity;

            // Check stock for new quantity
            if (variant.stockQuantity < newQuantity) {
                throw new HttpException(
                    `Insufficient stock. Only ${variant.stockQuantity} items available`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const updatedItem = await this.cartRepository.updateCartItemQuantity(
                existingCartItem.id,
                newQuantity,
            );

            return updatedItem;
        }

        // Add new item to cart
        const cartItem = await this.cartRepository.addCartItem(
            cart.id,
            variantId,
            quantity,
        );

        return cartItem;
    }

    // ------------------------------- Update Cart Item Quantity -------------------------------
    public async updateCartItemQuantity(
        customerId: string,
        cartItemId: string,
        updateCartItemDto: UpdateCartItemDto,
    ) {
        const { quantity } = updateCartItemDto;

        // Check if cart item exists
        const cartItem = await this.cartRepository.findCartItemById(cartItemId);

        if (!cartItem) {
            throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
        }

        // Verify the cart belongs to the customer
        if (cartItem.cart.customerId !== customerId) {
            throw new HttpException(
                'Unauthorized to update this cart item',
                HttpStatus.FORBIDDEN,
            );
        }

        // Check variant stock
        const variant = await this.cartRepository.findVariantById(
            cartItem.variantId,
        );

        if (!variant) {
            throw new HttpException('Product variant not found', HttpStatus.NOT_FOUND);
        }

        if (variant.stockQuantity < quantity) {
            throw new HttpException(
                `Insufficient stock. Only ${variant.stockQuantity} items available`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const updatedItem = await this.cartRepository.updateCartItemQuantity(
            cartItemId,
            quantity,
        );

        return updatedItem;
    }

    // ------------------------------- Delete Cart Item -------------------------------
    public async deleteCartItem(customerId: string, cartItemId: string) {
        // Check if cart item exists
        const cartItem = await this.cartRepository.findCartItemById(cartItemId);

        if (!cartItem) {
            throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
        }

        // Verify the cart belongs to the customer
        if (cartItem.cart.customerId !== customerId) {
            throw new HttpException(
                'Unauthorized to delete this cart item',
                HttpStatus.FORBIDDEN,
            );
        }

        await this.cartRepository.deleteCartItem(cartItemId);
        return { message: 'Cart item deleted successfully' };
    }
}

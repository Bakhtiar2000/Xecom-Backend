import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WishlistRepository } from './wishlist.repository';
import { AddToWishlistDto } from './wishlist.dto';

@Injectable()
export class WishlistService {
    constructor(private readonly wishlistRepository: WishlistRepository) { }

    // ------------------------------- Get All Wishlists -------------------------------
    public async getAllWishlists(userId: string) {
        const wishlists = await this.wishlistRepository.findAll(userId);
        return wishlists;
    }

    // ------------------------------- Add to Wishlist -------------------------------
    public async addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto) {
        const { productId } = addToWishlistDto;

        // Check if product already in wishlist
        const existingWishlist = await this.wishlistRepository.findByUserAndProduct(
            userId,
            productId,
        );

        if (existingWishlist) {
            throw new HttpException(
                'Product already in wishlist',
                HttpStatus.CONFLICT,
            );
        }

        const wishlist = await this.wishlistRepository.create(userId, productId);
        return wishlist;
    }

    // ------------------------------- Remove from Wishlist -------------------------------
    public async removeFromWishlist(userId: string, wishlistId: string) {
        // Check if wishlist item exists
        const wishlist = await this.wishlistRepository.findById(wishlistId);

        if (!wishlist) {
            throw new HttpException('Wishlist item not found', HttpStatus.NOT_FOUND);
        }

        // Verify the wishlist belongs to the user
        if (wishlist.userId !== userId) {
            throw new HttpException(
                'Unauthorized to remove this wishlist item',
                HttpStatus.FORBIDDEN,
            );
        }

        await this.wishlistRepository.delete(wishlistId);
    }
}

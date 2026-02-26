import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Delete,
    Param,
    Res,
    Req,
    UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from 'src/guard/auth.guard';
import sendResponse from 'src/utils/sendResponse';
import type { Request, Response } from 'express';
import { AddToWishlistDto } from './wishlist.dto';
import { IdDto } from 'src/common/id.dto';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    // Get all wishlists
    @Get()
    async getAllWishlists(@Req() req: Request, @Res() res: Response) {
        const userId = req.user.id;
        const result = await this.wishlistService.getAllWishlists(userId);
        sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'Wishlists fetched successfully',
            data: result,
        });
    }

    // Add to wishlist
    @Post()
    async addToWishlist(
        @Req() req: Request,
        @Body() addToWishlistDto: AddToWishlistDto,
        @Res() res: Response,
    ) {
        const userId = req.user.id;
        const result = await this.wishlistService.addToWishlist(
            userId,
            addToWishlistDto,
        );
        sendResponse(res, {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: 'Product added to wishlist successfully',
            data: result,
        });
    }

    // Remove from wishlist
    @Delete(':id')
    async removeFromWishlist(
        @Req() req: Request,
        @Param() params: IdDto,
        @Res() res: Response,
    ) {
        const userId = req.user.id;
        await this.wishlistService.removeFromWishlist(
            userId,
            params.id,
        );
        sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: "Product removed from wishlist successfully",
            data: null,
        });
    }
}

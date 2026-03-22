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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/guard/auth.guard';
import sendResponse from 'src/utils/sendResponse';
import type { Request, Response } from 'express';
import { AddToCartDto, UpdateCartItemDto } from './cart.dto';
import { IdDto } from 'src/common/id.dto';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Get my cart items
  @Get()
  async getMyCartItems(@Req() req: Request, @Res() res: Response) {
    const userId = req.user.id;
    const result = await this.cartService.getMyCartItems(userId);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Cart items fetched successfully',
      data: result,
    });
  }

  // Add to cart
  @Post()
  async addToCart(
    @Req() req: Request,
    @Body() addToCartDto: AddToCartDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.cartService.addToCart(userId, addToCartDto);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Item added to cart successfully',
      data: result,
    });
  }

  // Update cart item quantity
  @Put(':id')
  async updateCartItemQuantity(
    @Req() req: Request,
    @Param() params: IdDto,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.cartService.updateCartItemQuantity(
      userId,
      params.id,
      updateCartItemDto,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Cart item quantity updated successfully',
      data: result,
    });
  }

  // Delete cart item
  @Delete(':id')
  async deleteCartItem(
    @Req() req: Request,
    @Param() params: IdDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.cartService.deleteCartItem(userId, params.id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  }
}

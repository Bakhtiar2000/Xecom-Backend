import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Param,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/guard/auth.guard';
import sendResponse from 'src/utils/sendResponse';
import type { Request, Response } from 'express';
import { PlaceOrderDto, UpdateOrderStatusDto } from './order.dto';
import { IdDto } from 'src/common/id.dto';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from 'src/generated/prisma';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Place order (Customer)
  @Post()
  async placeOrder(
    @Req() req: Request,
    @Body() placeOrderDto: PlaceOrderDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.orderService.placeOrder(userId, placeOrderDto);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Order placed successfully',
      data: result,
    });
  }

  // Get my orders (Customer)
  @Get('my-orders')
  async getMyOrders(
    @Req() req: Request,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('status') status: string,
    @Query('searchTerm') searchTerm: string,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const page = parseInt(pageNumber) || 1;
    const size = parseInt(pageSize) || 20;

    const result = await this.orderService.getMyOrders(
      userId,
      page,
      size,
      sortBy,
      sortOrder as 'asc' | 'desc',
      status,
      searchTerm,
    );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'My orders fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }

  // Get single order (Customer)
  @Get('my-orders/:id')
  async getMyOrder(
    @Req() req: Request,
    @Param() params: IdDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.orderService.getSingleOrder(userId, params.id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Order fetched successfully',
      data: result,
    });
  }

  // Cancel order (Customer)
  @Put('my-orders/:id/cancel')
  async cancelOrder(
    @Req() req: Request,
    @Param() params: IdDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.orderService.cancelOrder(userId, params.id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Order cancelled successfully',
      data: result,
    });
  }

  // Get all orders (Admin)
  @Get()
  @UseGuards(RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async getAllOrders(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('status') status: string,
    @Query('searchTerm') searchTerm: string,
    @Query('deliveredFrom') deliveredFrom: string,
    @Query('deliveredTo') deliveredTo: string,
    @Query('customerId') customerId: string,
    @Res() res: Response,
  ) {
    const page = parseInt(pageNumber) || 1;
    const size = parseInt(pageSize) || 20;

    const result = await this.orderService.getAllOrders(
      page,
      size,
      sortBy,
      sortOrder as 'asc' | 'desc',
      status,
      searchTerm,
      deliveredFrom,
      deliveredTo,
      customerId,
    );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Orders fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }

  // Get single order (Admin)
  @Get(':id')
  @UseGuards(RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async getSingleOrder(@Param() params: IdDto, @Res() res: Response) {
    const result = await this.orderService.getSingleOrderAdmin(params.id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Order fetched successfully',
      data: result,
    });
  }

  // Update order status (Admin)
  @Put(':id/status')
  @UseGuards(RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async updateOrderStatus(
    @Param() params: IdDto,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Res() res: Response,
  ) {
    const result = await this.orderService.updateOrderStatus(
      params.id,
      updateOrderStatusDto,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Order status updated successfully',
      data: result,
    });
  }

  // Cancel order (Admin)
  @Put(':id/cancel')
  @UseGuards(RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async cancelOrderAdmin(
    @Param() params: IdDto,
    @Body('internalNotes') internalNotes: string,
    @Res() res: Response,
  ) {
    const result = await this.orderService.cancelOrderAdmin(
      params.id,
      internalNotes,
    );
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Order cancelled successfully',
      data: result,
    });
  }
}

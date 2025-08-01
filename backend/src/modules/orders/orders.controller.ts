import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(
    @Request() req,
    @Body() body: {
      items: Array<{
        productId: string;
        quantity: number;
        price: number;
      }>;
      shippingInfo: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
      };
      billingInfo: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
      };
    },
  ) {
    return this.ordersService.createOrder({
      userId: req.user.id,
      items: body.items,
      totalAmount: body.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      ...body.shippingInfo,
      ...body.billingInfo,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  async getUserOrders(@Request() req) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrderById(@Request() req, @Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId, req.user.id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() body: { status: string },
  ) {
    return this.ordersService.updateOrderStatus(orderId, body.status as any);
  }

  @Get('admin/all')
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }
}

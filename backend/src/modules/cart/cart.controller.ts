import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(
    @Request() req,
    @Body() body: { productId: string; quantity?: number },
  ) {
    return this.cartService.addToCart(
      req.user.id,
      body.productId,
      body.quantity || 1,
    );
  }

  @Put('update')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateCartItem(
    @Request() req,
    @Body() body: { itemId: string; quantity: number },
  ) {
    return this.cartService.updateCartItem(
      req.user.id,
      body.itemId,
      body.quantity,
    );
  }

  @Delete('remove/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeFromCart(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeFromCart(req.user.id, itemId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}

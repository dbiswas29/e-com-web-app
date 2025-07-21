import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from '../types/cart-item.interface'; // Adjust path if needed

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCartItems(): Promise<CartItem[]> {
    return this.cartService.getCartItems();
  }

  @Post()
  async addCartItem(@Body() item: CartItem): Promise<CartItem> {
    return this.cartService.addCartItem(item);
  }

  @Delete(':id')
  async removeCartItem(@Param('id') id: string): Promise<void> {
    await this.cartService.removeCartItem(id);
  }
}
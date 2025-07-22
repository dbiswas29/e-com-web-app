import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return null;
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return {
      ...cart,
      totalItems,
      totalPrice,
      items: cart.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          features: JSON.parse(item.product.features || '[]'),
        },
      })),
    };
  }

  async addToCart(userId: string, productId: string, quantity = 1) {
    // Get or create cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    await this.prisma.cartItem.update({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    await this.prisma.cartItem.delete({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getCart(userId);
  }
}

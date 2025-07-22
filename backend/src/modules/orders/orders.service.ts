import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, items: any[], shippingInfo: any, billingInfo: any) {
    // Calculate total amount
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount: total,
        status: 'PENDING',
        // Shipping information
        shippingFirstName: shippingInfo.firstName,
        shippingLastName: shippingInfo.lastName,
        shippingAddress1: shippingInfo.address1,
        shippingAddress2: shippingInfo.address2,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingZipCode: shippingInfo.zipCode,
        shippingCountry: shippingInfo.country,
        shippingPhone: shippingInfo.phone,
        // Billing information
        billingFirstName: billingInfo.firstName,
        billingLastName: billingInfo.lastName,
        billingAddress1: billingInfo.address1,
        billingAddress2: billingInfo.address2,
        billingCity: billingInfo.city,
        billingState: billingInfo.state,
        billingZipCode: billingInfo.zipCode,
        billingCountry: billingInfo.country,
        billingPhone: billingInfo.phone,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders;
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async getAllOrders() {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders;
  }
}

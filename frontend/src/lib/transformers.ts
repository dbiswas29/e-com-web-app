import { Order, OrderStatus, Address } from '@/types';

export function transformOrderData(backendOrder: any): Order {
  return {
    id: backendOrder.id,
    userId: backendOrder.userId,
    items: backendOrder.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: item.product,
    })),
    totalAmount: backendOrder.totalAmount,
    status: backendOrder.status.toLowerCase() as OrderStatus,
    shippingAddress: {
      firstName: backendOrder.shippingFirstName,
      lastName: backendOrder.shippingLastName,
      address1: backendOrder.shippingAddress1,
      address2: backendOrder.shippingAddress2,
      city: backendOrder.shippingCity,
      state: backendOrder.shippingState,
      zipCode: backendOrder.shippingZipCode,
      country: backendOrder.shippingCountry,
      phone: backendOrder.shippingPhone,
    } as Address,
    billingAddress: {
      firstName: backendOrder.billingFirstName,
      lastName: backendOrder.billingLastName,
      address1: backendOrder.billingAddress1,
      address2: backendOrder.billingAddress2,
      city: backendOrder.billingCity,
      state: backendOrder.billingState,
      zipCode: backendOrder.billingZipCode,
      country: backendOrder.billingCountry,
      phone: backendOrder.billingPhone,
    } as Address,
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt,
  };
}

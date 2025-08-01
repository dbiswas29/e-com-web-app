import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;
export type OrderItemDocument = OrderItem & Document;

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Schema({
  timestamps: true,
  collection: 'order_items',
})
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number; // Price at the time of order
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  timestamps: true,
  collection: 'orders',
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: OrderStatus, 
    default: OrderStatus.PENDING 
  })
  status: OrderStatus;

  @Prop({ required: true })
  totalAmount: number;

  // Shipping Address
  @Prop({ required: true })
  shippingFirstName: string;

  @Prop({ required: true })
  shippingLastName: string;

  @Prop({ required: true })
  shippingAddress1: string;

  @Prop()
  shippingAddress2?: string;

  @Prop({ required: true })
  shippingCity: string;

  @Prop({ required: true })
  shippingState: string;

  @Prop({ required: true })
  shippingZipCode: string;

  @Prop({ required: true })
  shippingCountry: string;

  @Prop()
  shippingPhone?: string;

  // Billing Address
  @Prop({ required: true })
  billingFirstName: string;

  @Prop({ required: true })
  billingLastName: string;

  @Prop({ required: true })
  billingAddress1: string;

  @Prop()
  billingAddress2?: string;

  @Prop({ required: true })
  billingCity: string;

  @Prop({ required: true })
  billingState: string;

  @Prop({ required: true })
  billingZipCode: string;

  @Prop({ required: true })
  billingCountry: string;

  @Prop()
  billingPhone?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'OrderItem' }], default: [] })
  items: Types.ObjectId[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Add virtual fields
OrderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

OrderItemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

OrderSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

OrderItemSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

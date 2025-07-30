import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;
export type CartItemDocument = CartItem & Document;

@Schema({
  timestamps: true,
  collection: 'cart_items',
})
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Cart', required: true })
  cartId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({
  timestamps: true,
  collection: 'carts',
})
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'CartItem' }], default: [] })
  items: Types.ObjectId[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Add virtual fields
CartSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

CartItemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

CartSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

CartItemSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

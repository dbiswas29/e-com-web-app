import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ 
    type: [String], 
    default: [] 
  })
  images: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ 
    type: [String], 
    default: [] 
  })
  features: string[];

  @Prop({ default: true })
  isActive: boolean;

  // Virtual fields for relations
  cartItems?: Types.ObjectId[];
  orderItems?: Types.ObjectId[];
  reviews?: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add virtual fields
ProductSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ProductSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

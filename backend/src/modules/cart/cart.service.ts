import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument, CartItem, CartItemDocument } from '../../schemas/cart.schema';
import { Product, ProductDocument } from '../../schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getCart(userId: string) {
    // Find or create cart for user
    let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });

    if (!cart) {
      cart = await this.cartModel.create({ userId: new Types.ObjectId(userId), items: [] });
    }

    // Get cart items with populated products
    const items = await this.cartItemModel.find({ cartId: cart._id }).populate('productId').exec();
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      if (item.productId && typeof item.productId === 'object' && 'price' in item.productId) {
        return sum + ((item.productId as any).price * item.quantity);
      }
      return sum;
    }, 0);

    return {
      ...cart.toJSON(),
      items: items.map(item => ({
        ...item.toJSON(),
        product: item.productId ? (item.productId as any).toJSON() : null
      })),
      totalItems,
      totalPrice
    };
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    // Find or create cart
    let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart) {
      cart = await this.cartModel.create({ userId: new Types.ObjectId(userId), items: [] });
    }

    // Check if item already exists in cart
    const existingItem = await this.cartItemModel.findOne({
      cartId: cart._id,
      productId: new Types.ObjectId(productId)
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      // Create new cart item
      const newItem = await this.cartItemModel.create({
        cartId: cart._id,
        productId: new Types.ObjectId(productId),
        quantity
      });
      cart.items.push(newItem._id as Types.ObjectId);
      await cart.save();
    }

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart) return null;

    const item = await this.cartItemModel.findOne({
      _id: new Types.ObjectId(itemId),
      cartId: cart._id
    });

    if (!item) return null;

    if (quantity <= 0) {
      await this.cartItemModel.findByIdAndDelete(item._id);
      cart.items = cart.items.filter(itemObjectId => !(itemObjectId as Types.ObjectId).equals(item._id as Types.ObjectId));
      await cart.save();
    } else {
      item.quantity = quantity;
      await item.save();
    }

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string) {
    const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart) return null;

    const item = await this.cartItemModel.findOne({
      _id: new Types.ObjectId(itemId),
      cartId: cart._id
    });

    if (!item) return null;

    await this.cartItemModel.findByIdAndDelete(item._id);
    cart.items = cart.items.filter(itemObjectId => !(itemObjectId as Types.ObjectId).equals(item._id as Types.ObjectId));
    await cart.save();

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart) return null;

    // Delete all cart items
    await this.cartItemModel.deleteMany({ cartId: cart._id });
    
    // Clear cart items array
    cart.items = [];
    await cart.save();

    return cart;
  }
}

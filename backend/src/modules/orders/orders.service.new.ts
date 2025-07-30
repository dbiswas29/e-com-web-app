import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderItem, OrderItemDocument, OrderStatus } from '../../schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItemDocument>,
  ) {}

  async create(orderData: any) {
    const order = await this.orderModel.create({
      ...orderData,
      userId: new Types.ObjectId(orderData.userId),
    });

    // Create order items
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: any) => ({
        orderId: order._id,
        productId: new Types.ObjectId(item.productId),
        quantity: item.quantity,
        price: item.price,
      }));

      const createdItems = await this.orderItemModel.insertMany(orderItems);
      order.items = createdItems.map(item => item._id);
      await order.save();
    }

    return this.findOne(order._id.toString());
  }

  async findAll() {
    return this.orderModel
      .find()
      .populate({
        path: 'items',
        populate: {
          path: 'productId',
          model: 'Product'
        }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUserId(userId: string) {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'items',
        populate: {
          path: 'productId',
          model: 'Product'
        }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<OrderDocument | null> {
    return this.orderModel
      .findById(id)
      .populate({
        path: 'items',
        populate: {
          path: 'productId',
          model: 'Product'
        }
      })
      .exec();
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDocument | null> {
    return this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate({
        path: 'items',
        populate: {
          path: 'productId',
          model: 'Product'
        }
      })
      .exec();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Order } from '../entities/order.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/products/entities/product.entity';
import { UsersService } from './users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private userSerice: UsersService,
  ) {}

  findAll() {
    return this.orderModel.find().populate('products').populate('user').exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('products')
      .populate('user')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async findOneByUserId(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const order = await this.orderModel
      .findOne({ user: userObjectId })
      .populate('products')
      .exec();

    return order;
  }

  async create(data: CreateOrderDto) {
    const user = await this.userSerice.findById(data.user);
    const newModel = new this.orderModel({ user });

    const createdOrder = await newModel.save();
    return createdOrder;
  }

  async update(id: string, changes: UpdateOrderDto) {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return { message: `Order #${id} deleted successfully` };
  }

  async removeProduct(id: string, productId: string) {
    const order = await this.findOne(id);

    order.products.pull(productId);
    return order.save();
  }

  async addProducts(id: string, productsIds: Product[]) {
    const order = await this.findOne(id);

    productsIds.forEach((pId) => {
      order.products.push(pId);
    });
    return order.save();
  }
}

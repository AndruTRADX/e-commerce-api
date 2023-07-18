import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '../dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(param?: FilterProductsDto) {
    if (param) {
      const filters: FilterQuery<Product> = {};
      const { limit, offset } = param;
      const { minPrice, maxPrice } = param;

      if (minPrice && maxPrice) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }

      return await this.productModel
        .find(filters)
        .skip(offset * limit)
        .limit(limit)
        .exec();
    }
    return await this.productModel.find().exec();
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .populate('brand')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    return await newProduct.save();
  }

  async update(id: string, changes: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    } else {
      return { message: `Product "${product.name}" deleted successfully` };
    }
  }
}

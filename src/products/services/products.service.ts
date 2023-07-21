import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '../dtos/product.dto';
import { CategoriesService } from './categories.service';
import { BrandsService } from './brands.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
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

  async searchProducts(query: string) {
    const products = await this.productModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          {
            category: {
              $in: await this.categoriesService.findCategoryIdByName(query),
            },
          },
          {
            brand: {
              $in: await this.brandsService.findBrandIdByName(query),
            },
          },
        ],
      })
      .populate('category')
      .populate('brand')
      .exec();

    if (!products) {
      return null;
    }
    return products;
  }

  async findProductsByCategoryId(categoryId: string) {
    try {
      const products = await this.productModel
        .find({
          category: categoryId,
        })
        .exec();

      return products;
    } catch (error) {
      throw new NotFoundException(
        'Error when searching for products by category',
      );
    }
  }

  async findProductsByBrandId(brandId: string) {
    try {
      const products = await this.productModel
        .find({
          brand: brandId,
        })
        .exec();

      return products;
    } catch (error) {
      throw new NotFoundException('Error when searching for products by brand');
    }
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

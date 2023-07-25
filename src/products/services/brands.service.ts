import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async findAll() {
    return await this.brandModel.find().exec();
  }

  async findOneById(id: string) {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  async findOneByName(name: string) {
    const brand = await this.brandModel
      .findOne({
        name: { $regex: name, $options: 'i' },
      })
      .exec();

    if (!brand) {
      throw new NotFoundException(`Brand ${name} not found`);
    }
    return brand;
  }

  async findBrandIdByName(name: string) {
    const brands = await this.brandModel.find({
      $or: [{ name: { $regex: name, $options: 'i' } }],
    });

    if (brands.length === 0) {
      return [];
    }

    const brandsIds = brands.map((brand) => brand._id.toString());
    return brandsIds;
  }

  create(data: CreateBrandDto) {
    const newBrand = new this.brandModel(data);
    return newBrand.save();
  }

  async update(id: string, changes: UpdateBrandDto) {
    const brand = await this.brandModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    return brand;
  }

  async remove(id: string) {
    const brand = await this.brandModel.findByIdAndDelete(id);

    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    } else {
      return { message: `Brand "${brand.name}" deleted successfully` };
    }
  }
}

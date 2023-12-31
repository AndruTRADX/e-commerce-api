import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      return null;
    }

    return user;
  }

  async findByToken(rawAccessToken: string) {
    const accessToken = rawAccessToken.replace('Bearer ', '');
    const decodedToken = this.jwtService.verify(accessToken);
    const userId = decodedToken.sub;

    const user = await this.findById(userId);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: CreateUserDto) {
    const newModel = new this.userModel(data);
    const hashPassword = await bcrypt.hash(newModel.password, 10);

    newModel.password = hashPassword;
    newModel.role = 'user';

    const model = await newModel.save();
    const obj = model.toObject();
    delete obj.password;
    return obj;
  }

  async update(id: string, changes: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return { message: `User "${user.name}" deleted successfully` };
  }
}

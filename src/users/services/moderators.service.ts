import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { Moderator } from '../entities/moderator.entity';
import { Role } from 'src/auth/models/roles.model';

import { CreateModeratorDto, UpdateModeratorDto } from '../dtos/moderator.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ModeratorsService {
  constructor(
    @InjectModel(Moderator.name) private moderatorModel: Model<Moderator>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.moderatorModel.find().exec();
  }

  async findById(id: string) {
    const moderator = await this.moderatorModel.findById(id);

    if (!moderator) {
      return null;
    }

    return moderator;
  }

  async findByEmail(email: string) {
    const moderator = await this.moderatorModel.findOne({ email }).exec();

    if (!moderator) {
      return null;
    }

    return moderator;
  }

  async findByToken(rawAccessToken: string) {
    const accessToken = rawAccessToken.replace('Bearer ', '');
    const decodedToken = this.jwtService.verify(accessToken);
    const moderatorId = decodedToken.sub;

    const moderator = await this.findById(moderatorId);

    if (!moderator) {
      return null;
    }

    return moderator;
  }

  async create(data: CreateModeratorDto) {
    const newModel = new this.moderatorModel(data);
    const hashPassword = await bcrypt.hash(newModel.password, 10);

    newModel.password = hashPassword;
    newModel.role = Role.MODERATOR;

    const model = await newModel.save();
    const obj = model.toObject();
    delete obj.password;
    return obj;
  }

  async update(id: string, changes: UpdateModeratorDto) {
    const moderator = await this.moderatorModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!moderator) {
      throw new NotFoundException(`Moderator #${id} not found`);
    }

    return moderator;
  }

  async remove(id: string) {
    const moderator = await this.moderatorModel.findByIdAndDelete(id);

    if (!moderator) {
      throw new NotFoundException(`Moderator #${id} not found`);
    }

    return { message: `Moderator "${moderator.name}" deleted successfully` };
  }
}

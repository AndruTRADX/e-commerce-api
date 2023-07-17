import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BrandsService } from '../services/brands.service';
import { MongoIdPipe } from 'src/common/mongo-id.pipe';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  getById(@Param('id', MongoIdPipe) id: string) {
    return this.brandsService.findOneById(id);
  }

  @Get(':name/name')
  getByName(@Param('name') name: string) {
    return this.brandsService.findOneByName(name);
  }

  @Post()
  create(@Body() payload: CreateBrandDto) {
    return this.brandsService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.brandsService.remove(id);
  }
}

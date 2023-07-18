import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BrandsService } from '../services/brands.service';
import { MongoIdPipe } from 'src/common/mongo-id.pipe';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Public()
  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Public()
  @Get(':id')
  getById(@Param('id', MongoIdPipe) id: string) {
    return this.brandsService.findOneById(id);
  }

  @Public()
  @Get(':name/name')
  getByName(@Param('name') name: string) {
    return this.brandsService.findOneByName(name);
  }

  @Roles(Role.MODERATOR)
  @Post()
  create(@Body() payload: CreateBrandDto) {
    return this.brandsService.create(payload);
  }

  @Roles(Role.MODERATOR)
  @Put(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, payload);
  }

  @Roles(Role.MODERATOR)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.brandsService.remove(id);
  }
}

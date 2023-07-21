import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/product.dto';
import { ProductsService } from '../services/products.service';
import { MongoIdPipe } from 'src/common/mongo-id.pipe';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  getProducts(@Query() param: FilterProductsDto) {
    return this.productsService.findAll(param);
  }

  @Public()
  @Get(':id')
  getOne(@Param('id', MongoIdPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Public()
  @Get('search/:query')
  searcher(@Param('query') query: string) {
    return this.productsService.searchProducts(query);
  }

  @Public()
  @Get('category/:categoryId')
  getByCategory(@Param('categoryId', MongoIdPipe) categoryId: string) {
    return this.productsService.findProductsByCategoryId(categoryId);
  }

  @Public()
  @Get('brand/:brandId')
  getByBrand(@Param('brandId', MongoIdPipe) brandId: string) {
    return this.productsService.findProductsByBrandId(brandId);
  }

  @Roles(Role.MODERATOR)
  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productsService.create(payload);
  }

  @Roles(Role.MODERATOR)
  @Put(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateProductDto,
  ) {
    return this.productsService.update(id, payload);
  }

  @Roles(Role.MODERATOR)
  @Delete(':id')
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.productsService.remove(id);
  }
}

import {
  Controller,
  Get,
  Param,
  Req,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from '../services/orders.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  AddProductsToOrderDto,
} from '../dtos/order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { UsersService } from '../services/users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private userService: UsersService,
  ) {}

  @Roles(Role.MODERATOR)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Public()
  @Get(':id')
  get(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Public()
  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.ordersService.findOneByUserId(userId);
  }

  @Post()
  async create(@Body() payload: CreateOrderDto, @Req() request) {
    const accessToken = request.headers.authorization;
    const user = await this.userService.findByToken(accessToken);
    return this.ordersService.create(payload, user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateOrderDto) {
    return this.ordersService.update(id, payload);
  }

  @Put(':id/products')
  updateProducts(
    @Param('id') id: string,
    @Body() payload: AddProductsToOrderDto,
  ) {
    return this.ordersService.addProducts(id, payload.productsIds);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Delete(':id/product/:productId')
  removeProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.ordersService.removeProduct(id, productId);
  }
}

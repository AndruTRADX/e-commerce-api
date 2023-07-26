import { IsNotEmpty, IsArray, IsMongoId } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Product } from 'src/products/entities/product.entity';
import { User } from '../entities/user.entity';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly user: User;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class AddProductsToOrderDto {
  @IsArray()
  @IsNotEmpty()
  readonly productsIds: Product[];
}

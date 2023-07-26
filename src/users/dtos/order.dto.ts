import { IsNotEmpty, IsArray, IsMongoId } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Product } from 'src/products/entities/product.entity';
import { User } from '../entities/user.entity';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly user: User;

  @IsArray()
  @IsNotEmpty()
  readonly products: Product[];
}

export class UpdateOrderDto extends PartialType(
  OmitType(CreateOrderDto, ['products']),
) {}

export class AddProductsToOrderDto {
  @IsArray()
  @IsNotEmpty()
  readonly productsIds: Product[];
}

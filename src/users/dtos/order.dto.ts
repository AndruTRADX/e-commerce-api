import { IsNotEmpty, IsArray, IsMongoId } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Product } from 'src/products/entities/product.entity';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly user: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class AddProductsToOrderDto {
  @IsArray()
  @IsNotEmpty()
  readonly productsIds: Product[];
}

import { IsMongoId, IsNotEmpty, IsArray } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Product } from 'src/products/entities/product.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly user: string;

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

import { OmitType } from '@nestjs/mapped-types';
import { IsMongoId, IsNumber, IsOptional, Max, Min } from 'class-validator';

class TradingProductDto {
  @IsMongoId({ message: 'Invalid product id provided' })
  productId: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  quantityTraded: number;

  @IsNumber({}, { message: 'Price must be a number' })
  pricePerUnit: number;

  @IsOptional()
  @IsNumber({}, { message: 'Discount must be a number' })
  discount: number;
}

export class BuyProductInfoDTO extends OmitType(TradingProductDto, [
  'discount',
]) {}

export class SellProductInfoDTO extends TradingProductDto {
  @IsMongoId({ message: 'Invalid supplier id provided' })
  fromSupplier: string;
}

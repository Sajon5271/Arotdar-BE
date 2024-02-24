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
  @Max(1, { message: 'Discount must be between 0 and 1' })
  @Min(0, { message: 'Discount must be between 0 and 1' })
  discount: number;
}

export class BuyProductInfoDTO extends OmitType(TradingProductDto, [
  'discount',
]) {}

export class SellProductInfoDTO extends TradingProductDto {}

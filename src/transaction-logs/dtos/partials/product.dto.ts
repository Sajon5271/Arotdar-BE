import { OmitType } from '@nestjs/mapped-types';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

class TradingProductDto {
  @IsMongoId({ message: 'Invalid product id provided' })
  productId: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  quantityTraded: number;

  @IsNumber({}, { message: 'Price must be a number' })
  pricePerUnit: number;

  @IsMongoId({ message: 'Invalid supplier id provided' })
  supplierId: string;

  @IsString()
  @IsNotEmpty({ message: 'SupplierName is required' })
  supplierName: string;

  @IsOptional()
  @IsNumber({}, { message: 'Discount must be a number' })
  discount: number;
}

export class BuyProductInfoDTO extends OmitType(TradingProductDto, [
  'discount',
]) {}

export class SellProductInfoDTO extends TradingProductDto {}

// import { PartialType } from '@nestjs/mapped-types';
import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  productName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'SupplierId is required' })
  supplierId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'SupplierName is required' })
  supplierName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productDescription?: string;

  @ApiProperty()
  // @Min(0)
  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a number' })
  totalCurrentQuantity: number;

  @ApiProperty()
  @Min(0, { message: 'Price cannot be less than 0' })
  @IsNumber({}, { message: 'Price must be a number' })
  currentPricePerUnit: number;
}

export class UpdateProductDto extends PartialType(ProductDto) {}

export class UpdatePriceDto extends PickType(ProductDto, [
  'currentPricePerUnit',
]) {}

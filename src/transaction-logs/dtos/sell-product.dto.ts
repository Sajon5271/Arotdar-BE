import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { SellProductInfoDTO } from './partials/product.dto';

export class SellProductDTO {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        quantityTraded: { type: 'number' },
        pricePerUnit: { type: 'number' },
        discount: { type: 'number', minimum: 0, maximum: 1, default: 0 },
      },
    },
  })
  @IsArray({ message: 'Invalid data model' })
  @ArrayNotEmpty({ message: 'No data provided' })
  @ValidateNested({ each: true })
  @Type(() => SellProductInfoDTO)
  products: SellProductInfoDTO[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ message: 'Invalid Partner Id' })
  partnerId?: string;

  @ApiProperty()
  @IsOptional()
  partnerName?: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Due must be a number' })
  due: number;

  @ApiProperty()
  @IsNumber({}, { message: 'Paid amount must be a number' })
  paid: number;

  @ApiProperty()
  @IsNumber({}, { message: 'Final price must be a number' })
  finalPrice: number;
}

import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { TransactionType } from '../../enums/Transaction.enum';
import { CustomerType, PartnerType } from '../../enums/UserTypes.enum';
import { Type } from 'class-transformer';

export class TradedProduct {
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
  discount?: number;
}

export class NewTransactionDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        quantityTraded: { type: 'number' },
        pricePerUnit: { type: 'number' },
        discount: { type: 'number', maximum: 1, minimum: 0 },
      },
    },
  })
  @IsArray({ message: 'Invalid data model' })
  @ArrayNotEmpty({ message: 'No data provided' })
  @ValidateNested({ each: true })
  @Type(() => TradedProduct)
  products: TradedProduct[];

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType, { message: 'Wrong transaction type' })
  transactionType: TransactionType;

  @ApiProperty({ enum: PartnerType })
  @IsEnum(PartnerType, { message: 'Wrong partner type' })
  partnerType: PartnerType;

  @ApiPropertyOptional({ enum: CustomerType })
  @ValidateIf((obj) => obj.partnerType === PartnerType.Customer)
  @IsEnum(CustomerType, { message: 'Wrong Customer Type' })
  customerType?: CustomerType;

  @ApiPropertyOptional()
  @IsMongoId({ message: 'Invalid Partner Id' })
  @IsOptional()
  partnerId?: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Due amount must be a number' })
  due: number;

  @ApiProperty()
  @IsNumber({}, { message: 'Paid amount must be a number' })
  paid: number;

  @ApiProperty()
  @IsNumber({}, { message: 'Final paid amount must be a number' })
  finalPrice: number;
}

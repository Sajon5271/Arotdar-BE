import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { TransactionType } from '../../enums/Transaction.enum';
import { CustomerType, PartnerType } from '../../enums/UserTypes.enum';

export class NewTransactionDto {
  @ApiProperty()
  @IsMongoId({ message: 'Invalid Product Id' })
  @IsNotEmpty({ message: 'Product Id required' })
  productId: string;

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
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantityTraded: number;

  @ApiProperty()
  @IsNumber({}, { message: 'Price must be a number' })
  pricePerUnit: number;

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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../enums/Transaction.enum';
import { CustomerType, PartnerType } from '../enums/UserTypes.enum';
import { HydratedDocument } from 'mongoose';

export type TransactionLogModel = HydratedDocument<TransactionLogs>;

@Schema({ timestamps: true })
export class TransactionLogs {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  @Prop()
  productId?: string;

  @ApiProperty()
  @Prop()
  productName?: string;

  @ApiProperty({ enum: TransactionType })
  @Prop({ required: true, type: Number })
  transactionType: TransactionType;

  @ApiProperty({ enum: PartnerType })
  @Prop({ required: true, type: Number })
  partnerType: PartnerType;

  @ApiProperty({ enum: CustomerType })
  @Prop({ type: Number })
  customerType?: CustomerType;

  @ApiProperty()
  @Prop()
  partnerId?: string;

  @ApiProperty()
  @Prop()
  partnerName?: string;

  @ApiProperty()
  @Prop({ required: true })
  quantityTraded: number;

  @ApiProperty()
  @Prop({ required: true })
  pricePerUnit: number;

  @ApiProperty()
  @Prop({ required: true })
  due: number;

  @ApiProperty()
  @Prop({ required: true })
  paid: number;

  @ApiProperty()
  @Prop({ required: true })
  finalPrice: number;

  @ApiPropertyOptional()
  createdAt?: Date | string;

  @ApiPropertyOptional()
  updatedAt?: Date;

  @Prop({ required: true })
  updatedBy: string;
}

export const TransactionLogSchema =
  SchemaFactory.createForClass(TransactionLogs);

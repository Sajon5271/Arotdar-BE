import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { TransactionType } from '../enums/Transaction.enum';

export type InventoryLogsModel = HydratedDocument<InventoryLogs>;

@Schema({ timestamps: true })
export class InventoryLogs {
  @ApiProperty()
  @Transform((params) => params.obj._id)
  @Expose()
  _id?: string;

  @ApiProperty()
  @Expose()
  @Prop({ required: true })
  productId: string;

  @ApiProperty()
  @Expose()
  @Prop({ required: true })
  productName: string;

  @ApiProperty({ enum: TransactionType })
  @Expose()
  @Prop({ required: true, type: Number })
  transactionType: TransactionType;

  @ApiProperty()
  @Expose()
  @Prop({ required: true })
  quantityTraded: number;

  @ApiProperty()
  @Expose()
  @Prop({ required: true })
  totalQuantity: number;

  @ApiProperty()
  @Expose()
  @Prop({ required: true })
  pricePerUnit: number;

  @ApiPropertyOptional()
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional()
  @Expose()
  updatedAt?: Date;
}

export const InventoryLogsSchema = SchemaFactory.createForClass(InventoryLogs);

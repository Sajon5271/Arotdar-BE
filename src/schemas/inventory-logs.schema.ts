import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { TransactionType } from '../enums/Transaction.enum';

export enum InventoryLogType {
  Creation,
  QuantityUpdate,
  PriceUpdate,
  GeneralUpdate,
}

export type InventoryLogsModel = HydratedDocument<InventoryLogs>;

@Schema({ timestamps: true })
export class InventoryLogs {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  @Prop({ required: true })
  productId: string;

  @ApiProperty()
  @Prop({ required: true })
  productName: string;

  @ApiProperty({ enum: TransactionType })
  @Prop({ required: true, type: Number })
  transactionType: TransactionType;

  @ApiProperty()
  @Prop({ required: true })
  quantityTraded: number;

  @ApiProperty()
  @Prop({ required: true })
  totalQuantity: number;

  @ApiProperty()
  @Prop({ required: true })
  pricePerUnit: number;

  @Prop({ required: true, default: InventoryLogType.GeneralUpdate })
  logType: InventoryLogType;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;

  @Prop({ required: true })
  updatedBy: string;
}

export const InventoryLogsSchema = SchemaFactory.createForClass(InventoryLogs);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { CustomerType } from '../enums/UserTypes.enum';
import {
  SellTradProductSchema,
  SellTradeProduct,
  TradedProduct,
  TradedProductSchema,
} from './partials/TradedProduct.schema';

export type SellLogModel = HydratedDocument<SellLogs>;

@Schema({ timestamps: true })
export class SellLogs {
  @ApiProperty()
  _id?: string;
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        quantityTraded: { type: 'number' },
        pricePerUnit: { type: 'number' },
        discount: { type: 'number', maximum: 1, minimum: 0 },
        buyingPrices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              countSold: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @Prop({ required: true, type: [SellTradProductSchema] })
  products: SellTradeProduct[];

  @ApiProperty({ enum: CustomerType })
  @Prop({ type: Number })
  customerType: CustomerType;

  @ApiProperty()
  @Prop()
  partnerId?: string;

  @ApiProperty()
  @Prop()
  partnerName?: string;

  @ApiProperty()
  @Prop({ required: true })
  lotsUsedInTrade: string[];

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

export const SellLogSchema = SchemaFactory.createForClass(SellLogs);

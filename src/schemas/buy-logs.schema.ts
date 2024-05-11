import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import {
  TradedProduct,
  TradedProductSchema,
} from './partials/TradedProduct.schema';

export type BuyLogModel = HydratedDocument<BuyLogs>;

@Schema({ timestamps: true })
export class BuyLogs {
  @ApiProperty()
  _id?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        quantityTraded: { type: 'number' },
        productName: { type: 'string' },
        pricePerUnit: { type: 'number' },
        discount: { type: 'number', default: 0 },
      },
    },
  })
  @Prop({ required: true, type: [TradedProductSchema] })
  products: TradedProduct[];

  @ApiProperty()
  @Prop({ required: true })
  partnerId: string;

  @ApiProperty()
  @Prop()
  partnerName?: string;

  @ApiProperty()
  @Prop({ required: true })
  due: number;

  @ApiProperty()
  @Prop({ required: true })
  paid: number;

  @ApiProperty()
  @Prop({ required: true })
  finalPrice: number;

  @ApiProperty()
  @Prop({ required: true })
  affectedLotIds: string[];

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;

  @Prop({ required: true })
  updatedBy: string;
}

export const BuyLogsSchema = SchemaFactory.createForClass(BuyLogs);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TradedProduct {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantityTraded: number;

  @Prop({ required: true })
  pricePerUnit: number;

  @Prop({}) discount?: number;
}

export const TradedProductSchema = SchemaFactory.createForClass(TradedProduct);

export class SellTradeProduct extends TradedProduct {
  @Prop({ required: true })
  buyingPrices: { id: string; countSold: number; boughtPricePerUnit: number }[];
}
export const SellTradProductSchema =
  SchemaFactory.createForClass(SellTradeProduct);

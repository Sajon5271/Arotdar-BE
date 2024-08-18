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

@Schema()
export class BuyingPrices {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  countSold: number;

  @Prop({ required: true })
  boughtPricePerUnit: number;
}

export const BuyingPricesSchema = SchemaFactory.createForClass(BuyingPrices);

@Schema()
export class SellTradeProduct extends TradedProduct {
  @Prop({ required: true, type: [BuyingPricesSchema] })
  buyingPrices: BuyingPrices[];

  @Prop({ required: true })
  fromSupplier: string;
}

export const SellTradProductSchema =
  SchemaFactory.createForClass(SellTradeProduct);

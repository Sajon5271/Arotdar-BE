import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TradedProduct {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantityTraded: number;

  @Prop({ required: true })
  pricePerUnit: number;

  @Prop({}) discount?: number;
}

export const TradedProductSchema = SchemaFactory.createForClass(TradedProduct);

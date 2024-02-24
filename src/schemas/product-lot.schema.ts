import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';

export type ProductLotModel = HydratedDocument<ProductLotInfo>;

@Schema({ timestamps: true })
export class ProductLotInfo extends Document {
  @ApiProperty()
  @Prop({ required: true })
  _id?: string;

  @ApiProperty()
  @Prop({ required: true })
  lotProductId: string;

  @ApiProperty()
  @Prop({ required: true })
  buyingPrice: number;

  @ApiProperty()
  @Prop({ required: true })
  quantityBought: number;

  @ApiProperty()
  @Prop({ required: true })
  quantityRemaining: number;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}

export const ProductLotSchema = SchemaFactory.createForClass(ProductLotInfo);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { PartnerType } from '../enums/UserTypes.enum';
import { Expose } from 'class-transformer';

export type TradingParnerModel = HydratedDocument<TradingPartner>;

@Schema()
export class TradingPartner {
  @ApiProperty()
  @Expose()
  _id?: string;

  @Prop({ required: true })
  @ApiProperty()
  @Expose()
  name: string;

  @Prop()
  @ApiPropertyOptional()
  @Expose()
  email?: string;

  @Prop({ required: true, type: Number })
  @ApiProperty()
  @Expose()
  type: number;

  @Prop()
  @ApiPropertyOptional()
  @Expose()
  companyName?: string;

  // @ApiProperty()
  // createdAt: string;
}

export const TradingPartnerSchema =
  SchemaFactory.createForClass(TradingPartner);

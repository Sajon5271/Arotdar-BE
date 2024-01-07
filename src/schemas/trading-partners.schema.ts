import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { PartnerType } from '../enums/UserTypes.enum';

export type TradingParnerModel = HydratedDocument<TradingPartner>;

@Schema({ timestamps: true })
export class TradingPartner {
  @ApiProperty()
  _id?: string;

  @Prop({ required: true })
  @ApiProperty()
  name: string;

  @Prop()
  @ApiPropertyOptional()
  email?: string;

  @Prop({ required: true, type: Number })
  @ApiProperty({ enum: PartnerType })
  type: PartnerType;

  @Prop()
  @ApiPropertyOptional()
  companyName?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
  // @ApiProperty()
  // createdAt: string;
}

export const TradingPartnerSchema =
  SchemaFactory.createForClass(TradingPartner);

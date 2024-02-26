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

  @Prop({ required: true })
  @ApiProperty()
  totalCurrentDue: number;

  @Prop({ required: true })
  @ApiProperty()
  totalLifetimePaid: number;

  @Prop({ required: true })
  @ApiProperty()
  totalCurrentSalesQuantity: number;

  @Prop({ required: true })
  @ApiProperty()
  totalTrades: number;

  @ApiPropertyOptional()
  createdAt?: Date | string;

  @ApiPropertyOptional()
  updatedAt?: Date;
}

export const TradingPartnerSchema =
  SchemaFactory.createForClass(TradingPartner);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { PartnerType } from '../enums/UserTypes.enum';
import { Expose, Transform } from 'class-transformer';

export type TradingParnerModel = HydratedDocument<TradingPartner>;

@Schema({ timestamps: true })
export class TradingPartner {
  @ApiProperty()
  @Transform((params) => params.obj._id)
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
  @ApiProperty({ enum: PartnerType })
  @Expose()
  type: PartnerType;

  @Prop()
  @ApiPropertyOptional()
  @Expose()
  companyName?: string;

  @ApiPropertyOptional()
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional()
  @Expose()
  updatedAt?: Date;
  // @ApiProperty()
  // createdAt: string;
}

export const TradingPartnerSchema =
  SchemaFactory.createForClass(TradingPartner);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type InventoryModel = HydratedDocument<Inventory>;

@Schema({ timestamps: true })
export class Inventory {
  @ApiProperty()
  @Transform((params) => params.obj._id)
  @Expose()
  _id?: string;

  @ApiProperty()
  @Expose()
  @Prop({ required: true })
  productName: string;

  @ApiPropertyOptional()
  @Expose()
  @Prop()
  productDescription?: string;

  @ApiProperty()
  @Expose()
  @Prop({ required: true })
  quantity: number;

  @ApiProperty()
  @Expose()
  @Prop({ required: true })
  currentPricePerUnit: number;

  @ApiPropertyOptional()
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional()
  @Expose()
  updatedAt?: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

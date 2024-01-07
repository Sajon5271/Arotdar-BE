import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type InventoryModel = HydratedDocument<Inventory>;

@Schema({ timestamps: true })
export class Inventory {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  @Prop({ required: true })
  productName: string;

  @ApiPropertyOptional()
  @Prop()
  productDescription?: string;

  @ApiProperty()
  @Prop({ required: true })
  quantity: number;

  @ApiProperty()
  @Prop({ required: true })
  currentPricePerUnit: number;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

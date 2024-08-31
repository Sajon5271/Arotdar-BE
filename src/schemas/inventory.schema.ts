import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
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
  totalCurrentQuantity: number;

  @ApiPropertyOptional()
  @Prop({ required: true, default: [] })
  lotIdsContainingProduct: string[];

  @ApiPropertyOptional()
  @Prop({ required: true, default: [] })
  currentAvailableSuppliers: string[];

  @ApiProperty()
  @Prop({ required: true })
  currentPricePerUnit: number;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}

export class UpdateInventory extends PartialType(Inventory) {}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

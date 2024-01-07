import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserModel = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  _id: string;

  @Prop({ required: true })
  @ApiProperty()
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  @ApiProperty()
  email: string;

  @Prop({ required: true })
  @ApiProperty()
  roles: string[];

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

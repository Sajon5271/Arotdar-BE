import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserModel = HydratedDocument<User>;

@Schema()
export class User {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

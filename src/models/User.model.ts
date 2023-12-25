import { Schema, model } from 'mongoose';

export interface UserModel {
  name: string;
  password: string;
  email: string;
}

const userSchema = new Schema<UserModel>({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export const User = model<UserModel>('User', userSchema);

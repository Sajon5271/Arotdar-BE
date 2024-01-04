import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../constants/default.constants';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}
  async getAll(): Promise<User[]> {
    return await this.users.find({});
  }

  async createUser(email: string, name: string, password: string) {
    try {
      const existingUser = await this.users.findOne({ email });
      if (existingUser) throw new Error('User already exists');
      const hasedPassword = await hash(password, BCRYPT_SALT_ROUNDS);
      const newUser = new this.users({ email, name, password: hasedPassword });
      return await newUser.save();
    } catch (err) {
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Bad data provided',
      );
    }
  }
}

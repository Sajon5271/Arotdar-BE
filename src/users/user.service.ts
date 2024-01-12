import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { BCRYPT_SALT_ROUNDS } from '../constants/default.constants';
import { User } from '../schemas/user.schema';
import { plainToClass } from 'class-transformer';
import { PublicUserProperties } from './public-user-properties';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}

  async getAll(): Promise<User[]> {
    return await this.users.find({});
  }

  async createUser(
    email: string,
    name: string,
    password: string,
    roles: string[],
  ) {
    const existingUser = await this.users.findOne({ email });
    if (existingUser) throw new BadRequestException('User already exists');
    const hasedPassword = await hash(password, BCRYPT_SALT_ROUNDS);
    const newUser = new this.users({
      email,
      name,
      password: hasedPassword,
      roles,
    });
    await newUser.save();
    return newUser;
  }

  async checkCredintials(email: string, password: string): Promise<User> {
    const existingUser = await this.users.findOne({ email });
    if (!existingUser) throw new NotFoundException('User not found');
    const correctPassword = await compare(password, existingUser.password);
    if (!correctPassword)
      throw new UnauthorizedException('Username or Password wrong');
    return existingUser;
  }

  async getLoggedInUser(id: string): Promise<PublicUserProperties> {
    const currentUser = await this.users.findById(id);
    if (!currentUser) throw new UnauthorizedException('Invalid user');
    return plainToClass(PublicUserProperties, currentUser, {
      excludeExtraneousValues: true,
    });
  }
  async deleteUser(id: string): Promise<null> {
    try {
      await this.users.findByIdAndDelete(id);
    } catch (err) {
      console.log(err);
    }
    return null;
  }
}

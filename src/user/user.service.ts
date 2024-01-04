import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { hash, compare } from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../constants/default.constants';

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
    return await newUser.save();
  }

  async checkCredintials(email: string, password: string): Promise<User> {
    const existingUser = await this.users.findOne({ email });
    if (!existingUser) throw new NotFoundException('User not found');
    const correctPassword = await compare(password, existingUser.password);
    if (!correctPassword)
      throw new UnauthorizedException('Username or Password wrong');
    return existingUser;
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthController } from './auth.controller';
import { UserController } from '../users/user.controller';
import { UserService } from '../users/user.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
})
export class AuthModule {}

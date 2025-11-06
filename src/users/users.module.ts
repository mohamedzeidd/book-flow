import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { AuthController } from './auth.controller';
import { BcryptService } from 'src/global/bcrypt/bcrypt.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  controllers: [UsersController , AuthController],
  providers: [UsersService, AuthService , BcryptService],
})
export class UsersModule {}

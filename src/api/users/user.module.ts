import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../core/entity/user.entity';
import { CustomJwtService } from 'src/common/jwt/jwt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: config.ACCESS_TOKEN_SECRET_KEY, // JWT uchun maxfiy kalit
      signOptions: { expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME }, // Token muddati
    }),
  ],
  controllers: [UserController],
  providers: [UserService, CustomJwtService, JwtService],
})
export class UserModule {}

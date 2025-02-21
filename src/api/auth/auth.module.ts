import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { UserEntity } from 'src/core/entity';
import { config } from 'src/config';
import { CustomJwtService } from '../../common/jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), // UserEntity repository
    JwtModule.register({
      secret: config.ACCESS_TOKEN_SECRET_KEY, // JWT uchun maxfiy kalit
      signOptions: { expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME }, // Token muddati
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, CustomJwtService, JwtService], // AuthService va UserService provider sifatida kiritiladi
  exports: [AuthService], // AuthService'ni boshqa joyda ishlatish uchun eksport qilamiz
})
export class AuthModule {}

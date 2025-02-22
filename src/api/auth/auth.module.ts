import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from 'src/core/entity';
import { UserModule } from '../users/user.module';
import { CustomJwtModule } from 'src/common/jwt/jwt.module';
import { TokenService } from 'src/common/jwt/jwt.service';
import { BcryptService } from 'src/common/bcrypt/bcrypt';
import { MailModule } from 'src/common/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), // UserEntity repository
    UserModule,
    CustomJwtModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, BcryptService], // AuthService va UserService provider sifatida kiritiladi
  exports: [AuthService], // AuthService'ni boshqa joyda ishlatish uchun eksport qilamiz
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomJwtService } from './jwt-auth.guard';
import { TokenService } from './jwt.service';
import { config } from 'src/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: config.ACCESS_TOKEN_SECRET_KEY,
        signOptions: {
          expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME,
        },
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: config.REFRESH_TOKEN_SECRET_KEY,
        signOptions: {
          expiresIn: config.REFRESH_TOKEN_EXPIRE_TIME,
        },
      }),
    }),
  ],
  providers: [CustomJwtService, TokenService],
  exports: [CustomJwtService, TokenService],
})
export class CustomJwtModule {}

import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Injectable()
export class CustomJwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  // Access token yaratish
  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: config.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME,
    });
  }

  // Refresh token yaratish
  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: config.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: config.REFRESH_TOKEN_EXPIRE_TIME,
    });
  }

  // Tokenni tekshirish
  async verifyToken(
    token: string,
    isRefreshToken: boolean = false,
  ): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: isRefreshToken
          ? config.REFRESH_TOKEN_SECRET_KEY
          : config.ACCESS_TOKEN_SECRET_KEY,
      });
    } catch (error) {
      console.log(error);
      throw new Error('Token is invalid or expired');
    }
  }
}

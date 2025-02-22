import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: config.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME,
    });
  }

  createRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: config.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: config.REFRESH_TOKEN_EXPIRE_TIME,
    });
  }
  async verifyAccessToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.ACCESS_TOKEN_SECRET_KEY,
      });
      return payload;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.REFRESH_TOKEN_SECRET_KEY,
      });
      return payload;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
